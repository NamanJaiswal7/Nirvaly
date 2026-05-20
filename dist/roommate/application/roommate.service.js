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
exports.RoommateService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma.service");
let RoommateService = class RoommateService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMatches(userId) {
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
    async likeMatch(matchId, userId) {
        const match = await this.prisma.match.findUnique({ where: { id: matchId } });
        if (!match)
            throw new common_1.NotFoundException('Match not found');
        const isUser1 = match.userId1 === userId;
        const isUser2 = match.userId2 === userId;
        if (!isUser1 && !isUser2)
            throw new common_1.ForbiddenException('Not part of this match');
        const newStatus = match.status === 'LIKED' ? 'MUTUAL' : 'LIKED';
        return this.prisma.match.update({
            where: { id: matchId },
            data: { status: newStatus },
        });
    }
    async createGroup(dto, adminId) {
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
    async getGroupById(groupId) {
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
        if (!group)
            throw new common_1.NotFoundException('Group not found');
        return group;
    }
    async getGroupsForUser(userId) {
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
    async addMember(groupId, dto, requesterId) {
        const group = await this.prisma.group.findUnique({
            where: { id: groupId },
            include: { members: true },
        });
        if (!group)
            throw new common_1.NotFoundException('Group not found');
        if (group.adminId !== requesterId) {
            throw new common_1.ForbiddenException('Only the group admin can add members');
        }
        if (group.status !== 'FORMING' && group.status !== 'ACTIVE') {
            throw new common_1.BadRequestException('Cannot add members in current group status');
        }
        const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const existing = group.members.find((m) => m.userId === dto.userId);
        if (existing)
            throw new common_1.BadRequestException('User is already a member');
        await this.prisma.groupMember.create({
            data: { groupId, userId: dto.userId },
        });
        if (group.status === 'FORMING') {
            await this.prisma.group.update({
                where: { id: groupId },
                data: { status: 'ACTIVE' },
            });
        }
        return this.getGroupById(groupId);
    }
    async createPoll(groupId, dto, userId) {
        const group = await this.prisma.group.findUnique({
            where: { id: groupId },
            include: { members: true },
        });
        if (!group)
            throw new common_1.NotFoundException('Group not found');
        if (!group.members.find((m) => m.userId === userId)) {
            throw new common_1.ForbiddenException('Not a member of this group');
        }
        const property = await this.prisma.property.findUnique({ where: { id: dto.propertyId } });
        if (!property)
            throw new common_1.NotFoundException('Property not found');
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
        await this.prisma.group.update({
            where: { id: groupId },
            data: { status: 'VOTING' },
        });
        return poll;
    }
    async getPolls(groupId) {
        return this.prisma.poll.findMany({
            where: { groupId },
            include: {
                property: true,
                votes: { include: { user: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async voteOnPoll(groupId, pollId, dto, userId) {
        const poll = await this.prisma.poll.findUnique({
            where: { id: pollId },
            include: { votes: true, group: { include: { members: true } } },
        });
        if (!poll)
            throw new common_1.NotFoundException('Poll not found');
        if (poll.groupId !== groupId)
            throw new common_1.BadRequestException('Poll does not belong to this group');
        if (poll.status !== 'OPEN')
            throw new common_1.BadRequestException(`Poll is already ${poll.status}`);
        if (new Date() > poll.expiresAt) {
            await this.prisma.poll.update({ where: { id: pollId }, data: { status: 'EXPIRED' } });
            throw new common_1.BadRequestException('Poll has expired');
        }
        if (!poll.group.members.find((m) => m.userId === userId)) {
            throw new common_1.ForbiddenException('Not a member of this group');
        }
        if (poll.votes.find((v) => v.userId === userId)) {
            throw new common_1.BadRequestException('Already voted on this poll');
        }
        await this.prisma.vote.create({
            data: {
                pollId,
                userId,
                decision: dto.decision,
            },
        });
        const updatedVotes = await this.prisma.vote.findMany({ where: { pollId } });
        const totalMembers = poll.group.members.length;
        let newStatus = poll.status;
        if (dto.decision === 'PASS') {
            newStatus = 'FAILED';
        }
        else if (updatedVotes.length === totalMembers &&
            updatedVotes.every((v) => v.decision === 'LIKE')) {
            newStatus = 'PASSED';
        }
        if (newStatus !== poll.status) {
            await this.prisma.poll.update({ where: { id: pollId }, data: { status: newStatus } });
        }
        return this.prisma.poll.findUnique({
            where: { id: pollId },
            include: {
                property: true,
                votes: { include: { user: true } },
            },
        });
    }
    async submitGroupApplication(groupId, userId) {
        const group = await this.prisma.group.findUnique({
            where: { id: groupId },
            include: {
                members: { include: { user: { include: { roommateProfile: true } } } },
                polls: { where: { status: 'PASSED' } },
            },
        });
        if (!group)
            throw new common_1.NotFoundException('Group not found');
        if (group.adminId !== userId) {
            throw new common_1.ForbiddenException('Only the group admin can submit applications');
        }
        if (group.polls.length === 0) {
            throw new common_1.BadRequestException('No passed poll — unanimous approval required before applying');
        }
        await this.prisma.group.update({
            where: { id: groupId },
            data: { status: 'APPLICATION_SUBMITTED' },
        });
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
};
exports.RoommateService = RoommateService;
exports.RoommateService = RoommateService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RoommateService);
//# sourceMappingURL=roommate.service.js.map