import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  /** GET /v1/groups/:id/messages */
  async getMessages(groupId: string, userId: string) {
    // Verify membership
    const member = await this.prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId } },
    });
    if (!member) throw new ForbiddenException('Not a member of this group');

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

  /** POST /v1/groups/:id/messages */
  async sendMessage(groupId: string, userId: string, content: string) {
    const member = await this.prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId } },
    });
    if (!member) throw new ForbiddenException('Not a member of this group');

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

  /** System message (auto-generated) */
  async sendSystemMessage(groupId: string, systemUserId: string, content: string) {
    return this.prisma.groupMessage.create({
      data: { groupId, userId: systemUserId, content },
    });
  }
}
