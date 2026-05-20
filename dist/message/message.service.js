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
exports.MessageService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
let MessageService = class MessageService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMessages(groupId, userId) {
        const member = await this.prisma.groupMember.findUnique({
            where: { groupId_userId: { groupId, userId } },
        });
        if (!member)
            throw new common_1.ForbiddenException('Not a member of this group');
        const messages = await this.prisma.groupMessage.findMany({
            where: { groupId },
            include: { user: { select: { id: true, name: true, avatarUrl: true } } },
            orderBy: { createdAt: 'asc' },
            take: 100,
        });
        return {
            messages,
            _links: {
                self: { href: `/v1/groups/${groupId}/messages` },
                send: { href: `/v1/groups/${groupId}/messages`, method: 'POST' },
                group: { href: `/v1/groups/${groupId}` },
            },
        };
    }
    async sendMessage(groupId, userId, content) {
        const member = await this.prisma.groupMember.findUnique({
            where: { groupId_userId: { groupId, userId } },
        });
        if (!member)
            throw new common_1.ForbiddenException('Not a member of this group');
        const message = await this.prisma.groupMessage.create({
            data: { groupId, userId, content },
            include: { user: { select: { id: true, name: true, avatarUrl: true } } },
        });
        return {
            ...message,
            _links: {
                group: { href: `/v1/groups/${groupId}` },
                messages: { href: `/v1/groups/${groupId}/messages` },
            },
        };
    }
    async sendSystemMessage(groupId, systemUserId, content) {
        return this.prisma.groupMessage.create({
            data: { groupId, userId: systemUserId, content },
        });
    }
};
exports.MessageService = MessageService;
exports.MessageService = MessageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MessageService);
//# sourceMappingURL=message.service.js.map