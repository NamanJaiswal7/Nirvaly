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
exports.PropertyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
const hateoas_helper_1 = require("../common/hateoas.helper");
let PropertyService = class PropertyService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async searchProperties(query, city, minPrice, maxPrice) {
        const properties = await this.prisma.property.findMany({
            where: {
                ...(city && { city: { contains: city, mode: 'insensitive' } }),
                ...(minPrice && { price: { gte: minPrice } }),
                ...(maxPrice && { price: { lte: maxPrice } }),
                ...(query && {
                    OR: [
                        { title: { contains: query, mode: 'insensitive' } },
                        { description: { contains: query, mode: 'insensitive' } },
                        { address: { contains: query, mode: 'insensitive' } },
                    ],
                }),
            },
            orderBy: { createdAt: 'desc' },
        });
        return properties.map((p) => ({
            ...p,
            _links: {
                ...(0, hateoas_helper_1.propertyLinks)(p.id),
                shareToGroup: { href: '/v1/groups/{groupId}/polls', method: 'POST' },
            },
        }));
    }
    async getPropertyById(id) {
        const property = await this.prisma.property.findUnique({ where: { id } });
        if (!property)
            throw new common_1.NotFoundException('Property not found');
        return {
            ...property,
            _links: {
                ...(0, hateoas_helper_1.propertyLinks)(id),
                shareToGroup: { href: '/v1/groups/{groupId}/polls', method: 'POST' },
            },
        };
    }
    async getPropertyGroupPolls(propertyId, userId) {
        const property = await this.prisma.property.findUnique({ where: { id: propertyId } });
        if (!property)
            throw new common_1.NotFoundException('Property not found');
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
        return polls.map((poll) => ({
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
};
exports.PropertyService = PropertyService;
exports.PropertyService = PropertyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PropertyService);
//# sourceMappingURL=property.service.js.map