import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { RoommateRepository } from '../../infrastructure/roommate.repository';
import { NotificationService } from '../../../notification/notification.service';
import { MessageService } from '../../../message/message.service';
import {
  computePollStatus,
  canAddMember,
  shouldActivateGroup,
  canSubmitApplication,
  POLL_EXPIRY_HOURS,
  GroupStatus,
  PollStatus,
} from '../../domain/roommate.model';

/**
 * Application Layer — COMMANDS (Lab 3 Figure 3.4, CQRS Write Side)
 *
 * Each method corresponds to a Lab 3 command:
 *   CreateGroupCommand, AddMemberCommand, CreatePollCommand,
 *   VotePropertyCommand, SubmitGroupAppCommand
 *
 * Business rules are delegated to the Domain Model (roommate.model.ts).
 * Data access is delegated to the Infrastructure Repository.
 */
@Injectable()
export class RoommateCommandService {
  constructor(
    private repo: RoommateRepository,
    private notifications: NotificationService,
    private messages: MessageService,
  ) {}

  // ─── LikeMatch — Lab 3 Use Case Step 1 ────────────────

  async likeMatch(matchId: string, userId: string) {
    const match = await this.repo.findMatchById(matchId);
    if (!match) throw new NotFoundException('Match not found');

    const isUser1 = match.userId1 === userId;
    const isUser2 = match.userId2 === userId;
    if (!isUser1 && !isUser2) throw new ForbiddenException('Not part of this match');

    // If other side already LIKED → mutual match (Lab 3 step 1)
    const newStatus = match.status === 'LIKED' ? 'MUTUAL' : 'LIKED';
    return this.repo.updateMatchStatus(matchId, newStatus);
  }

  // ─── CreateGroup — Lab 3 Use Case Steps 2-3 ───────────

  async createGroup(name: string, adminId: string) {
    return this.repo.createGroup(name, adminId);
  }

  // ─── AddMember — Lab 3 Use Case Step 3 (Invitee accepts) ──

  async addMember(groupId: string, userId: string, requesterId: string) {
    const group = await this.repo.findGroupById(groupId);
    if (!group) throw new NotFoundException('Group not found');
    if (group.adminId !== requesterId) {
      throw new ForbiddenException('Only the group admin can add members');
    }

    // Domain rule: check group status allows adding members
    if (!canAddMember(group.status)) {
      throw new BadRequestException('Cannot add members in current group status');
    }

    // Check user exists
    const user = await this.repo.findUserById(userId);
    if (!user) throw new NotFoundException('User not found');

    // Check not already a member
    if (group.members.find((m: any) => m.userId === userId)) {
      throw new BadRequestException('User is already a member');
    }

    await this.repo.addGroupMember(groupId, userId);

    // Domain rule: transition FORMING → ACTIVE when ≥2 members
    if (shouldActivateGroup(group.status, group.members.length + 1)) {
      await this.repo.updateGroupStatus(groupId, GroupStatus.ACTIVE);
    }

    // Notify the added user
    await this.notifications.create(
      userId, 'GROUP_INVITE',
      `You were added to "${group.name}"`,
      `You've been invited to join the group "${group.name}". Start chatting with your future roommates!`,
      { groupId },
    );

    // Auto-message in group chat
    await this.messages.sendSystemMessage(
      groupId, requesterId,
      `📢 ${user.name} has joined the group!`,
    );

    return this.repo.findGroupById(groupId);
  }

  // ─── CreatePoll — Lab 3 Use Case Steps 4-6 ────────────
  // Group stays ACTIVE — polls are independent per property

  async createPoll(groupId: string, propertyId: string, userId: string) {
    const group = await this.repo.findGroupById(groupId);
    if (!group) throw new NotFoundException('Group not found');

    if (group.status !== GroupStatus.ACTIVE) {
      throw new BadRequestException('Group must be ACTIVE to create polls');
    }

    // Verify requester is a member
    if (!group.members.find((m: any) => m.userId === userId)) {
      throw new ForbiddenException('Not a member of this group');
    }

    // Verify property exists
    const property = await this.repo.findPropertyById(propertyId);
    if (!property) throw new NotFoundException('Property not found');

    // Check if there's already an OPEN poll for this property in this group
    const existingPoll = group.polls?.find(
      (p: any) => p.propertyId === propertyId && p.status === 'OPEN',
    );
    if (existingPoll) {
      throw new BadRequestException('There is already an open poll for this property in this group');
    }

    // Domain rule: 48-hour expiry per State Machine (Figure 3.6)
    const expiresAt = new Date(Date.now() + POLL_EXPIRY_HOURS * 60 * 60 * 1000);

    const poll = await this.repo.createPoll(groupId, propertyId, expiresAt);

    // NOTE: Group stays ACTIVE — no status change

    // Auto-message: property shared in group chat
    await this.messages.sendSystemMessage(
      groupId, userId,
      `🏠 Shared a property: ${property.title} — €${property.price}/mo. Vote now!`,
    );

    // Notify all group members
    await this.notifications.notifyGroupMembers(
      groupId, userId, 'POLL_CREATED',
      `New property poll in "${group.name}"`,
      `${property.title} (€${property.price}/mo) — vote Like or Pass within 48h!`,
      { pollId: poll.id, propertyId },
    );

    return poll;
  }

  // ─── VoteProperty — Lab 3 Use Case Steps 7-8 ──────────

  async voteOnPoll(
    groupId: string,
    pollId: string,
    decision: string,
    userId: string,
  ) {
    const poll = await this.repo.findPollById(pollId);
    if (!poll) throw new NotFoundException('Poll not found');
    if (poll.groupId !== groupId)
      throw new BadRequestException('Poll does not belong to this group');
    if (poll.status !== 'OPEN')
      throw new BadRequestException(`Poll is already ${poll.status}`);

    // Domain rule: TimerExpires(48h) → EXPIRED
    if (new Date() > poll.expiresAt) {
      await this.repo.updatePollStatus(pollId, PollStatus.EXPIRED);
      throw new BadRequestException('Poll has expired');
    }

    // Verify voter is a group member
    if (!poll.group.members.find((m: any) => m.userId === userId)) {
      throw new ForbiddenException('Not a member of this group');
    }

    // Check if already voted
    if (poll.votes.find((v: any) => v.userId === userId)) {
      throw new BadRequestException('Already voted on this poll');
    }

    // Record vote
    await this.repo.createVote(pollId, userId, decision);

    // Re-fetch and compute new status using Domain Model rules
    const updatedVotes = await this.repo.findVotesByPoll(pollId);
    const totalMembers = poll.group.members.length;
    const newStatus = computePollStatus(updatedVotes, totalMembers);

    if (newStatus !== PollStatus.OPEN) {
      await this.repo.updatePollStatus(pollId, newStatus);
    }

    return this.repo.findPollById(pollId);
  }

  // ─── SubmitGroupApp — per-property application ──────
  // Group stays ACTIVE. Multiple applications allowed for different properties.

  async submitGroupApplication(groupId: string, propertyId: string, userId: string) {
    const group = await this.repo.findGroupById(groupId);
    if (!group) throw new NotFoundException('Group not found');

    // Find the PASSED poll for this specific property
    const passedPoll = group.polls?.find(
      (p: any) => p.propertyId === propertyId && p.status === 'PASSED',
    );

    if (!canSubmitApplication(group.status, passedPoll?.status ?? '')) {
      throw new BadRequestException(
        'Cannot submit — the property poll must be unanimously approved (PASSED) and the group must be ACTIVE',
      );
    }

    if (!passedPoll) {
      throw new BadRequestException('No passed poll found for this property');
    }

    // Mark poll as APPLIED so it can't be re-submitted
    await this.repo.updatePollStatus(passedPoll.id, 'APPLIED' as any);

    // NOTE: Group stays ACTIVE — can apply for more properties

    const property = await this.repo.findPropertyById(propertyId);

    // Notify all members
    await this.notifications.notifyGroupMembers(
      groupId, userId, 'APPLICATION_SUBMITTED',
      `Application submitted for ${property?.title ?? 'a property'}!`,
      `"${group.name}" applied for ${property?.title}. The landlord will review your application.`,
      { groupId, propertyId },
    );

    // Auto-message in group chat
    await this.messages.sendSystemMessage(
      groupId, userId,
      `🎉 Applied for ${property?.title ?? 'a property'}! The landlord will be notified.`,
    );

    // Bundle profiles and return application data
    return {
      groupId: group.id,
      groupName: group.name,
      status: 'APPLICATION_SUBMITTED',
      propertyId,
      property: property ? { id: property.id, title: property.title, price: property.price, address: property.address } : null,
      members: group.members.map((m: any) => ({
        userId: m.user.id,
        name: m.user.name,
        email: m.user.email,
        budgetMin: m.user.roommateProfile?.budgetMin ?? 0,
        budgetMax: m.user.roommateProfile?.budgetMax ?? 0,
        lifestyleTags: m.user.roommateProfile?.lifestyleTags ?? [],
      })),
      totalBudgetMin: group.members.reduce(
        (s: number, m: any) => s + (m.user.roommateProfile?.budgetMin ?? 0), 0,
      ),
      totalBudgetMax: group.members.reduce(
        (s: number, m: any) => s + (m.user.roommateProfile?.budgetMax ?? 0), 0,
      ),
      submittedAt: new Date().toISOString(),
      _links: {
        group: { href: `/v1/groups/${groupId}` },
        property: { href: `/v1/properties/${propertyId}` },
      },
    };
  }
}
