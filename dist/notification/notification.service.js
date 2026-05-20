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
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
let NotificationService = class NotificationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, type, title, body, data) {
        return this.prisma.notification.create({
            data: { userId, type, title, body, data },
        });
    }
    async notifyGroupMembers(groupId, excludeUserId, type, title, body, data) {
        const members = await this.prisma.groupMember.findMany({
            where: { groupId, userId: { not: excludeUserId } },
        });
        await Promise.all(members.map((m) => this.create(m.userId, type, title, body, { groupId, ...data })));
    }
    async getForUser(userId) {
        const notifications = await this.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
        return {
            notifications,
            unreadCount: notifications.filter((n) => !n.isRead).length,
            _links: {
                self: { href: '/v1/notifications' },
            },
        };
    }
    async markAsRead(notificationId, userId) {
        return this.prisma.notification.updateMany({
            where: { id: notificationId, userId },
            data: { isRead: true },
        });
    }
    async markAllAsRead(userId) {
        return this.prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true },
        });
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map