import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

/**
 * Infrastructure Layer — Lab 3 Figure 3.4: Repository (Group, Poll)
 * Encapsulates all data access, keeping Application layer clean.
 */
@Injectable()
export class RoommateRepository {
  constructor(private prisma: PrismaService) {}

  // ─── Match Repository ────────────────────────────────────

  findMatchesByUser(userId: string) {
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

  findMatchById(id: string) {
    return this.prisma.match.findUnique({ where: { id } });
  }

  updateMatchStatus(id: string, status: string) {
    return this.prisma.match.update({ where: { id }, data: { status: status as any } });
  }

  // ─── Group Repository ────────────────────────────────────

  createGroup(name: string, adminId: string) {
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

  findGroupById(id: string) {
    return this.prisma.group.findUnique({
      where: { id },
      include: {
        members: {
          include: { user: { include: { roommateProfile: true } } },
        },
        polls: {
          include: { property: true, votes: { include: { user: true } } },
          orderBy: { createdAt: 'desc' as const },
        },
      },
    });
  }

  findGroupsByUser(userId: string) {
    return this.prisma.group.findMany({
      where: { members: { some: { userId } } },
      include: {
        members: { include: { user: true } },
        _count: { select: { polls: true } },
      },
      orderBy: { createdAt: 'desc' as const },
    });
  }

  updateGroupStatus(id: string, status: string) {
    return this.prisma.group.update({
      where: { id },
      data: { status: status as any },
    });
  }

  // ─── Group Member Repository ─────────────────────────────

  addGroupMember(groupId: string, userId: string) {
    return this.prisma.groupMember.create({
      data: { groupId, userId },
    });
  }

  findUserById(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  // ─── Poll Repository ─────────────────────────────────────

  createPoll(groupId: string, propertyId: string, expiresAt: Date) {
    return this.prisma.poll.create({
      data: { groupId, propertyId, status: 'OPEN', expiresAt },
      include: { property: true, votes: true },
    });
  }

  findPollById(id: string) {
    return this.prisma.poll.findUnique({
      where: { id },
      include: {
        votes: { include: { user: true } },
        group: { include: { members: true } },
        property: true,
      },
    });
  }

  findPollsByGroup(groupId: string) {
    return this.prisma.poll.findMany({
      where: { groupId },
      include: {
        property: true,
        votes: { include: { user: true } },
      },
      orderBy: { createdAt: 'desc' as const },
    });
  }

  updatePollStatus(id: string, status: string) {
    return this.prisma.poll.update({
      where: { id },
      data: { status: status as any },
    });
  }

  // ─── Vote Repository ─────────────────────────────────────

  createVote(pollId: string, userId: string, decision: string) {
    return this.prisma.vote.create({
      data: { pollId, userId, decision: decision as any },
    });
  }

  findVotesByPoll(pollId: string) {
    return this.prisma.vote.findMany({ where: { pollId } });
  }

  // ─── Property Repository ─────────────────────────────────

  findPropertyById(id: string) {
    return this.prisma.property.findUnique({ where: { id } });
  }
}
