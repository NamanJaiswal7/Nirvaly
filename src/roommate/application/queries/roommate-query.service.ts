import { Injectable, NotFoundException } from '@nestjs/common';
import { RoommateRepository } from '../../infrastructure/roommate.repository';
import { matchLinks, groupLinks, pollLinks } from '../../../common/hateoas.helper';

/**
 * Application Layer — QUERIES (Lab 3 Figure 3.4, CQRS Read Side)
 * GetMatches, GetGroupDetails, GetPolls
 * All responses include HATEOAS _links for discoverability.
 */
@Injectable()
export class RoommateQueryService {
  constructor(private repo: RoommateRepository) {}

  /** GetMatches — Lab 3 Table 3.1: GET /v1/roommates/matches */
  async getMatches(userId: string) {
    const matches = await this.repo.findMatchesByUser(userId);
    const groups = await this.repo.findGroupsByUser(userId);
    return matches.map((m: any) => {
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
        // HATEOAS: available actions for this match
        _links: {
          ...matchLinks(m.id),
          createGroup: { href: '/v1/groups', method: 'POST' },
          existingGroups: groups.map((g: any) => ({
            groupId: g.id,
            groupName: g.name,
            addMember: { href: `/v1/groups/${g.id}/members`, method: 'POST' },
          })),
        },
      };
    });
  }

  /** GetGroupDetails — Lab 3 Table 3.1: GET /v1/groups/:id */
  async getGroupById(groupId: string) {
    const group = await this.repo.findGroupById(groupId);
    if (!group) throw new NotFoundException('Group not found');
    return {
      ...group,
      _links: groupLinks(groupId, group.status),
    };
  }

  /** GetGroupsForUser — Lab 3: GET /v1/groups */
  async getGroupsForUser(userId: string) {
    const groups = await this.repo.findGroupsByUser(userId);
    return groups.map((g: any) => ({
      ...g,
      _links: groupLinks(g.id, g.status),
    }));
  }

  /** GetPolls — Lab 3 Table 3.1: GET /v1/groups/:id/polls */
  async getPolls(groupId: string) {
    const polls = await this.repo.findPollsByGroup(groupId);
    return polls.map((p: any) => ({
      ...p,
      _links: pollLinks(groupId, p.id, p.status),
    }));
  }
}
