import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { propertyLinks } from '../common/hateoas.helper';

@Injectable()
export class PropertyService {
  constructor(private prisma: PrismaService) {}

  async searchProperties(query?: string, city?: string, minPrice?: number, maxPrice?: number) {
    const properties = await this.prisma.property.findMany({
      where: {
        ...(city && { city: { contains: city, mode: 'insensitive' as const } }),
        ...(minPrice && { price: { gte: minPrice } }),
        ...(maxPrice && { price: { lte: maxPrice } }),
        ...(query && {
          OR: [
            { title: { contains: query, mode: 'insensitive' as const } },
            { description: { contains: query, mode: 'insensitive' as const } },
            { address: { contains: query, mode: 'insensitive' as const } },
          ],
        }),
      },
      orderBy: { createdAt: 'desc' },
    });
    return properties.map((p) => ({
      ...p,
      _links: {
        ...propertyLinks(p.id),
        shareToGroup: { href: '/v1/groups/{groupId}/polls', method: 'POST' },
      },
    }));
  }

  async getPropertyById(id: string) {
    const property = await this.prisma.property.findUnique({ where: { id } });
    if (!property) throw new NotFoundException('Property not found');
    return {
      ...property,
      _links: {
        ...propertyLinks(id),
        shareToGroup: { href: '/v1/groups/{groupId}/polls', method: 'POST' },
      },
    };
  }

  /**
   * GET /v1/properties/:id/group-polls
   * Returns poll status for this property across all groups the user belongs to.
   * This powers the "Apply as Group" button on the property detail page.
   */
  async getPropertyGroupPolls(propertyId: string, userId: string) {
    const property = await this.prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) throw new NotFoundException('Property not found');

    // Find all polls for this property in groups the user is a member of
    const polls = await this.prisma.poll.findMany({
      where: {
        propertyId,
        group: {
          members: { some: { userId } },
        },
      },
      include: {
        group: {
          include: {
            members: {
              include: { user: { select: { id: true, name: true } } },
            },
          },
        },
        votes: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return polls.map((poll: any) => ({
      pollId: poll.id,
      groupId: poll.groupId,
      groupName: poll.group.name,
      groupAdminId: poll.group.adminId,
      status: poll.status,
      totalMembers: poll.group.members.length,
      totalVotes: poll.votes.length,
      allLiked: poll.status === 'PASSED',
      canApply: poll.status === 'PASSED' && poll.group.adminId === userId,
      _links: {
        vote: poll.status === 'OPEN'
          ? { href: `/v1/groups/${poll.groupId}/polls/${poll.id}/vote`, method: 'POST' }
          : null,
        apply: poll.status === 'PASSED'
          ? { href: `/v1/groups/${poll.groupId}/apply`, method: 'POST' }
          : null,
        group: { href: `/v1/groups/${poll.groupId}` },
      },
    }));
  }
}
