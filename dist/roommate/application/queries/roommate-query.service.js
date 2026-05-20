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
exports.RoommateQueryService = void 0;
const common_1 = require("@nestjs/common");
const roommate_repository_1 = require("../../infrastructure/roommate.repository");
const hateoas_helper_1 = require("../../../common/hateoas.helper");
let RoommateQueryService = class RoommateQueryService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async getMatches(userId) {
        const matches = await this.repo.findMatchesByUser(userId);
        const groups = await this.repo.findGroupsByUser(userId);
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
                _links: {
                    ...(0, hateoas_helper_1.matchLinks)(m.id),
                    createGroup: { href: '/v1/groups', method: 'POST' },
                    existingGroups: groups.map((g) => ({
                        groupId: g.id,
                        groupName: g.name,
                        addMember: { href: `/v1/groups/${g.id}/members`, method: 'POST' },
                    })),
                },
            };
        });
    }
    async getGroupById(groupId) {
        const group = await this.repo.findGroupById(groupId);
        if (!group)
            throw new common_1.NotFoundException('Group not found');
        return {
            ...group,
            _links: (0, hateoas_helper_1.groupLinks)(groupId, group.status),
        };
    }
    async getGroupsForUser(userId) {
        const groups = await this.repo.findGroupsByUser(userId);
        return groups.map((g) => ({
            ...g,
            _links: (0, hateoas_helper_1.groupLinks)(g.id, g.status),
        }));
    }
    async getPolls(groupId) {
        const polls = await this.repo.findPollsByGroup(groupId);
        return polls.map((p) => ({
            ...p,
            _links: (0, hateoas_helper_1.pollLinks)(groupId, p.id, p.status),
        }));
    }
};
exports.RoommateQueryService = RoommateQueryService;
exports.RoommateQueryService = RoommateQueryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [roommate_repository_1.RoommateRepository])
], RoommateQueryService);
//# sourceMappingURL=roommate-query.service.js.map