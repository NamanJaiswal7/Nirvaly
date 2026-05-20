import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateGroupDto, AddMemberDto, CreatePollDto, VotePropertyDto } from '../dto/roommate.dto';
import { PollStatus } from '@prisma/client';

@Injectable()
export class RoommateService {
  constructor(private prisma: PrismaService) {}

  // ─── Matches (Queries) ───────────────────────────────────

  /** GET /v1/roommates/matches — returns match candidates for the authenticated tenant */
  async getMatches(userId: string) {
    const matches = await this.prisma.match.findMany({
      where: {
        OR: [{ userId1: userId }, { userId2: userId }],
        status: { in: ['PENDING', 'LIKED'] },
      },
      include: {
        user1: { include: { roommateProfile: true } },
        user2: { include: { roommateProfile: true } },
      },
      orderBy: { compatibilityScore: 'desc' },
    });

    return matches.map((m) => {
      const candidate = m.userId1 === userId ? m.user2 : m.user1;
      return {
        matchId: m.id,
        candidateId: candidate.id,
        candidateName: candidate.name,
        candidateAvatar: candidate.avatarUrl,
        compatibilityScore: m.compatibilityScore,
        status: m.status,
        lifestyleTags: candidate.roommateProfile?.lifestyleTags ?? [],
        dealBreakers: candidate.roommateProfile?.dealBreakers ?? [],
        budgetMin: candidate.roommateProfile?.budgetMin ?? 0,
        budgetMax: candidate.roommateProfile?.budgetMax ?? 0,
        bio: candidate.roommateProfile?.bio ?? '',
      };
    });
  }

  /** POST /v1/roommates/matches/:id/like — like a match candidate */
  async likeMatch(matchId: string, userId: string) {
    const match = await this.prisma.match.findUnique({ where: { id: matchId } });
    if (!match) throw new NotFoundException('Match not found');

    // Determine if the current user is user1 or user2
    const isUser1 = match.userId1 === userId;
    const isUser2 = match.userId2 === userId;
    if (!isUser1 && !isUser2) throw new ForbiddenException('Not part of this match');

    // Check if the other side already liked → MUTUAL
    const newStatus = match.status === 'LIKED' ? 'MUTUAL' : 'LIKED';

    return this.prisma.match.update({
      where: { id: matchId },
      data: { status: newStatus },
    });
  }

  // ─── Groups (Commands & Queries) ─────────────────────────

  /** POST /v1/groups — create a new roommate group */
  async createGroup(dto: CreateGroupDto, adminId: string) {
    return this.prisma.group.create({
      data: {
        name: dto.name,
        adminId,
        status: 'FORMING',
        members: {
          create: { userId: adminId },
        },
      },
      include: { members: { include: { user: true } } },
    });
  }

  /** GET /v1/groups/:id — get group details */
  async getGroupById(groupId: string) {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: {
          include: {
            user: { include: { roommateProfile: true } },
          },
        },
        polls: {
          include: {
            property: true,
            votes: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!group) throw new NotFoundException('Group not found');
    return group;
  }

  /** GET /v1/groups — list groups for a user */
  async getGroupsForUser(userId: string) {
    return this.prisma.group.findMany({
      where: {
        members: { some: { userId } },
      },
      include: {
        members: { include: { user: true } },
        _count: { select: { polls: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** POST /v1/groups/:id/members — add a member to a group */
  async addMember(groupId: string, dto: AddMemberDto, requesterId: string) {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
      include: { members: true },
    });
    if (!group) throw new NotFoundException('Group not found');
    if (group.adminId !== requesterId) {
      throw new ForbiddenException('Only the group admin can add members');
    }
    if (group.status !== 'FORMING' && group.status !== 'ACTIVE') {
      throw new BadRequestException('Cannot add members in current group status');
    }

    // Check user exists
    const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('User not found');

    // Check not already a member
    const existing = group.members.find((m) => m.userId === dto.userId);
    if (existing) throw new BadRequestException('User is already a member');

    await this.prisma.groupMember.create({
      data: { groupId, userId: dto.userId },
    });

    // If group was FORMING and now has ≥2 members, transition to ACTIVE
    if (group.status === 'FORMING') {
      await this.prisma.group.update({
        where: { id: groupId },
        data: { status: 'ACTIVE' },
      });
    }

    return this.getGroupById(groupId);
  }

  // ─── Polls & Voting (Commands & Queries) ─────────────────

  /** POST /v1/groups/:id/polls — create a property voting poll */
  async createPoll(groupId: string, dto: CreatePollDto, userId: string) {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
      include: { members: true },
    });
    if (!group) throw new NotFoundException('Group not found');

    // Verify requester is a member
    if (!group.members.find((m) => m.userId === userId)) {
      throw new ForbiddenException('Not a member of this group');
    }

    // Verify property exists
    const property = await this.prisma.property.findUnique({ where: { id: dto.propertyId } });
    if (!property) throw new NotFoundException('Property not found');

    // 48-hour expiry per State Machine (Figure 3.6)
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

    const poll = await this.prisma.poll.create({
      data: {
        groupId,
        propertyId: dto.propertyId,
        status: 'OPEN',
        expiresAt,
      },
      include: { property: true, votes: true },
    });

    // Transition group to VOTING
    await this.prisma.group.update({
      where: { id: groupId },
      data: { status: 'VOTING' },
    });

    return poll;
  }

  /** GET /v1/groups/:id/polls — get all polls for a group */
  async getPolls(groupId: string) {
    return this.prisma.poll.findMany({
      where: { groupId },
      include: {
        property: true,
        votes: { include: { user: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** POST /v1/groups/:id/polls/:pollId/vote — cast a vote on a poll */
  async voteOnPoll(groupId: string, pollId: string, dto: VotePropertyDto, userId: string) {
    const poll = await this.prisma.poll.findUnique({
      where: { id: pollId },
      include: { votes: true, group: { include: { members: true } } },
    });
    if (!poll) throw new NotFoundException('Poll not found');
    if (poll.groupId !== groupId) throw new BadRequestException('Poll does not belong to this group');
    if (poll.status !== 'OPEN') throw new BadRequestException(`Poll is already ${poll.status}`);

    // Check expiry (TimerExpires(48h) → EXPIRED per State Machine)
    if (new Date() > poll.expiresAt) {
      await this.prisma.poll.update({ where: { id: pollId }, data: { status: 'EXPIRED' } });
      throw new BadRequestException('Poll has expired');
    }

    // Verify voter is a group member
    if (!poll.group.members.find((m) => m.userId === userId)) {
      throw new ForbiddenException('Not a member of this group');
    }

    // Check if already voted
    if (poll.votes.find((v) => v.userId === userId)) {
      throw new BadRequestException('Already voted on this poll');
    }

    // Record vote
    await this.prisma.vote.create({
      data: {
        pollId,
        userId,
        decision: dto.decision,
      },
    });

    // Re-fetch votes
    const updatedVotes = await this.prisma.vote.findMany({ where: { pollId } });
    const totalMembers = poll.group.members.length;

    // State Machine transitions (Figure 3.6)
    let newStatus: PollStatus = poll.status;

    // AnyMemberVotesPass → FAILED
    if (dto.decision === 'PASS') {
      newStatus = 'FAILED';
    }
    // AllMembersVoteLike → PASSED
    else if (
      updatedVotes.length === totalMembers &&
      updatedVotes.every((v) => v.decision === 'LIKE')
    ) {
      newStatus = 'PASSED';
    }

    if (newStatus !== poll.status) {
      await this.prisma.poll.update({ where: { id: pollId }, data: { status: newStatus } });
    }

    // Return updated poll state
    return this.prisma.poll.findUnique({
      where: { id: pollId },
      include: {
        property: true,
        votes: { include: { user: true } },
      },
    });
  }

  /** POST /v1/groups/:id/apply — submit group application */
  async submitGroupApplication(groupId: string, userId: string) {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: { include: { user: { include: { roommateProfile: true } } } },
        polls: { where: { status: 'PASSED' } },
      },
    });
    if (!group) throw new NotFoundException('Group not found');
    if (group.adminId !== userId) {
      throw new ForbiddenException('Only the group admin can submit applications');
    }
    if (group.polls.length === 0) {
      throw new BadRequestException('No passed poll — unanimous approval required before applying');
    }

    // Transition to APPLICATION_SUBMITTED
    await this.prisma.group.update({
      where: { id: groupId },
      data: { status: 'APPLICATION_SUBMITTED' },
    });

    // Return aggregated group application data
    return {
      groupId: group.id,
      groupName: group.name,
      status: 'APPLICATION_SUBMITTED',
      members: group.members.map((m) => ({
        userId: m.user.id,
        name: m.user.name,
        budgetMin: m.user.roommateProfile?.budgetMin ?? 0,
        budgetMax: m.user.roommateProfile?.budgetMax ?? 0,
      })),
      totalBudgetMin: group.members.reduce((s, m) => s + (m.user.roommateProfile?.budgetMin ?? 0), 0),
      totalBudgetMax: group.members.reduce((s, m) => s + (m.user.roommateProfile?.budgetMax ?? 0), 0),
      appliedPropertyId: group.polls[0]?.propertyId,
    };
  }
}
