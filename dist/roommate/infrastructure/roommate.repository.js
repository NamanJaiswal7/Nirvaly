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
exports.RoommateRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma.service");
let RoommateRepository = class RoommateRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findMatchesByUser(userId) {
        return this.prisma.match.findMany({
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
    }
    findMatchById(id) {
        return this.prisma.match.findUnique({ where: { id } });
    }
    updateMatchStatus(id, status) {
        return this.prisma.match.update({ where: { id }, data: { status: status } });
    }
    createGroup(name, adminId) {
        return this.prisma.group.create({
            data: {
                name,
                adminId,
                status: 'FORMING',
                members: { create: { userId: adminId } },
            },
            include: { members: { include: { user: true } } },
        });
    }
    findGroupById(id) {
        return this.prisma.group.findUnique({
            where: { id },
            include: {
                members: {
                    include: { user: { include: { roommateProfile: true } } },
                },
                polls: {
                    include: { property: true, votes: { include: { user: true } } },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
    }
    findGroupsByUser(userId) {
        return this.prisma.group.findMany({
            where: { members: { some: { userId } } },
            include: {
                members: { include: { user: true } },
                _count: { select: { polls: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    updateGroupStatus(id, status) {
        return this.prisma.group.update({
            where: { id },
            data: { status: status },
        });
    }
    addGroupMember(groupId, userId) {
        return this.prisma.groupMember.create({
            data: { groupId, userId },
        });
    }
    findUserById(userId) {
        return this.prisma.user.findUnique({ where: { id: userId } });
    }
    createPoll(groupId, propertyId, expiresAt) {
        return this.prisma.poll.create({
            data: { groupId, propertyId, status: 'OPEN', expiresAt },
            include: { property: true, votes: true },
        });
    }
    findPollById(id) {
        return this.prisma.poll.findUnique({
            where: { id },
            include: {
                votes: { include: { user: true } },
                group: { include: { members: true } },
                property: true,
            },
        });
    }
    findPollsByGroup(groupId) {
        return this.prisma.poll.findMany({
            where: { groupId },
            include: {
                property: true,
                votes: { include: { user: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    updatePollStatus(id, status) {
        return this.prisma.poll.update({
            where: { id },
            data: { status: status },
        });
    }
    createVote(pollId, userId, decision) {
        return this.prisma.vote.create({
            data: { pollId, userId, decision: decision },
        });
    }
    findVotesByPoll(pollId) {
        return this.prisma.vote.findMany({ where: { pollId } });
    }
    findPropertyById(id) {
        return this.prisma.property.findUnique({ where: { id } });
    }
};
exports.RoommateRepository = RoommateRepository;
exports.RoommateRepository = RoommateRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RoommateRepository);
//# sourceMappingURL=roommate.repository.js.map