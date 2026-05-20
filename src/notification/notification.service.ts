import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  /** Create a notification for a user */
  async create(userId: string, type: string, title: string, body: string, data?: any) {
    return this.prisma.notification.create({
      data: { userId, type, title, body, data },
    });
  }

  /** Notify all group members except the sender */
  async notifyGroupMembers(
    groupId: string,
    excludeUserId: string,
    type: string,
    title: string,
    body: string,
    data?: any,
  ) {
    const members = await this.prisma.groupMember.findMany({
      where: { groupId, userId: { not: excludeUserId } },
    });
    await Promise.all(
      members.map((m) =>
        this.create(m.userId, type, title, body, { groupId, ...data }),
      ),
    );
  }

  /** GET /v1/notifications — for current user */
  async getForUser(userId: string) {
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

  /** PATCH /v1/notifications/:id/read */
  async markAsRead(notificationId: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });
  }

  /** Mark all as read */
  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }
}
