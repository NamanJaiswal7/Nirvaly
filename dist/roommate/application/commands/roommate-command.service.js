"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoommateCommandService = void 0;
const common_1 = require("@nestjs/common");
const roommate_repository_1 = require("../../infrastructure/roommate.repository");
const notification_service_1 = require("../../../notification/notification.service");
const message_service_1 = require("../../../message/message.service");
const roommate_model_1 = require("../../domain/roommate.model");
let RoommateCommandService = class RoommateCommandService {
    repo;
    notifications;
    messages;
    constructor(repo, notifications, messages) {
        this.repo = repo;
        this.notifications = notifications;
        this.messages = messages;
    }
    async likeMatch(matchId, userId) {
        const match = await this.repo.findMatchById(matchId);
        if (!match)
            throw new common_1.NotFoundException('Match not found');
        const isUser1 = match.userId1 === userId;
        const isUser2 = match.userId2 === userId;
        if (!isUser1 && !isUser2)
            throw new common_1.ForbiddenException('Not part of this match');
        const newStatus = match.status === 'LIKED' ? 'MUTUAL' : 'LIKED';
        return this.repo.updateMatchStatus(matchId, newStatus);
    }
    async createGroup(name, adminId) {
        return this.repo.createGroup(name, adminId);
    }
    async addMember(groupId, userId, requesterId) {
        const group = await this.repo.findGroupById(groupId);
        if (!group)
            throw new common_1.NotFoundException('Group not found');
        if (group.adminId !== requesterId) {
            throw new common_1.ForbiddenException('Only the group admin can add members');
        }
        if (!(0, roommate_model_1.canAddMember)(group.status)) {
            throw new common_1.BadRequestException('Cannot add members in current group status');
        }
        const user = await this.repo.findUserById(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (group.members.find((m) => m.userId === userId)) {
            throw new common_1.BadRequestException('User is already a member');
        }
        await this.repo.addGroupMember(groupId, userId);
        if ((0, roommate_model_1.shouldActivateGroup)(group.status, group.members.length + 1)) {
            await this.repo.updateGroupStatus(groupId, roommate_model_1.GroupStatus.ACTIVE);
        }
        await this.notifications.create(userId, 'GROUP_INVITE', `You were added to "${group.name}"`, `You've been invited to join the group "${group.name}". Start chatting with your future roommates!`, { groupId });
        await this.messages.sendSystemMessage(groupId, requesterId, `📢 ${user.name} has joined the group!`);
        return this.repo.findGroupById(groupId);
    }
    async createPoll(groupId, propertyId, userId) {
        const group = await this.repo.findGroupById(groupId);
        if (!group)
            throw new common_1.NotFoundException('Group not found');
        if (group.status !== roommate_model_1.GroupStatus.ACTIVE) {
            throw new common_1.BadRequestException('Group must be ACTIVE to create polls');
        }
        if (!group.members.find((m) => m.userId === userId)) {
            throw new common_1.ForbiddenException('Not a member of this group');
        }
        const property = await this.repo.findPropertyById(propertyId);
        if (!property)
            throw new common_1.NotFoundException('Property not found');
        const existingPoll = group.polls?.find((p) => p.propertyId === propertyId && p.status === 'OPEN');
        if (existingPoll) {
            throw new common_1.BadRequestException('There is already an open poll for this property in this group');
        }
        const expiresAt = new Date(Date.now() + roommate_model_1.POLL_EXPIRY_HOURS * 60 * 60 * 1000);
        const poll = await this.repo.createPoll(groupId, propertyId, expiresAt);
        await this.messages.sendSystemMessage(groupId, userId, `🏠 Shared a property: ${property.title} — €${property.price}/mo. Vote now!`);
        await this.notifications.notifyGroupMembers(groupId, userId, 'POLL_CREATED', `New property poll in "${group.name}"`, `${property.title} (€${property.price}/mo) — vote Like or Pass within 48h!`, { pollId: poll.id, propertyId });
        return poll;
    }
    async voteOnPoll(groupId, pollId, decision, userId) {
        const poll = await this.repo.findPollById(pollId);
        if (!poll)
            throw new common_1.NotFoundException('Poll not found');
        if (poll.groupId !== groupId)
            throw new common_1.BadRequestException('Poll does not belong to this group');
        if (poll.status !== 'OPEN')
            throw new common_1.BadRequestException(`Poll is already ${poll.status}`);
        if (new Date() > poll.expiresAt) {
            await this.repo.updatePollStatus(pollId, roommate_model_1.PollStatus.EXPIRED);
            throw new common_1.BadRequestException('Poll has expired');
        }
        if (!poll.group.members.find((m) => m.userId === userId)) {
            throw new common_1.ForbiddenException('Not a member of this group');
        }
        if (poll.votes.find((v) => v.userId === userId)) {
            throw new common_1.BadRequestException('Already voted on this poll');
        }
        await this.repo.createVote(pollId, userId, decision);
        const updatedVotes = await this.repo.findVotesByPoll(pollId);
        const totalMembers = poll.group.members.length;
        const newStatus = (0, roommate_model_1.computePollStatus)(updatedVotes, totalMembers);
        if (newStatus !== roommate_model_1.PollStatus.OPEN) {
            await this.repo.updatePollStatus(pollId, newStatus);
        }
        return this.repo.findPollById(pollId);
    }
    async submitGroupApplication(groupId, propertyId, userId) {
        const group = await this.repo.findGroupById(groupId);
        if (!group)
            throw new common_1.NotFoundException('Group not found');
        const passedPoll = group.polls?.find((p) => p.propertyId === propertyId && p.status === 'PASSED');
        if (!(0, roommate_model_1.canSubmitApplication)(group.status, passedPoll?.status ?? '')) {
            throw new common_1.BadRequestException('Cannot submit — the property poll must be unanimously approved (PASSED) and the group must be ACTIVE');
        }
        if (!passedPoll) {
            throw new common_1.BadRequestException('No passed poll found for this property');
        }
        await this.repo.updatePollStatus(passedPoll.id, 'APPLIED');
        const property = await this.repo.findPropertyById(propertyId);
        await this.notifications.notifyGroupMembers(groupId, userId, 'APPLICATION_SUBMITTED', `Application submitted for ${property?.title ?? 'a property'}!`, `"${group.name}" applied for ${property?.title}. The landlord will review your application.`, { groupId, propertyId });
        await this.messages.sendSystemMessage(groupId, userId, `🎉 Applied for ${property?.title ?? 'a property'}! The landlord will be notified.`);
        return {
            groupId: group.id,
            groupName: group.name,
            status: 'APPLICATION_SUBMITTED',
            propertyId,
            property: property ? { id: property.id, title: property.title, price: property.price, address: property.address } : null,
            members: group.members.map((m) => ({
                userId: m.user.id,
                name: m.user.name,
                email: m.user.email,
                budgetMin: m.user.roommateProfile?.budgetMin ?? 0,
                budgetMax: m.user.roommateProfile?.budgetMax ?? 0,
                lifestyleTags: m.user.roommateProfile?.lifestyleTags ?? [],
            })),
            totalBudgetMin: group.members.reduce((s, m) => s + (m.user.roommateProfile?.budgetMin ?? 0), 0),
            totalBudgetMax: group.members.reduce((s, m) => s + (m.user.roommateProfile?.budgetMax ?? 0), 0),
            submittedAt: new Date().toISOString(),
            _links: {
                group: { href: `/v1/groups/${groupId}` },
                property: { href: `/v1/properties/${propertyId}` },
            },
        };
    }
};
exports.RoommateCommandService = RoommateCommandService;
exports.RoommateCommandService = RoommateCommandService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [roommate_repository_1.RoommateRepository,
        notification_service_1.NotificationService,
        message_service_1.MessageService])
], RoommateCommandService);
//# sourceMappingURL=roommate-command.service.js.map