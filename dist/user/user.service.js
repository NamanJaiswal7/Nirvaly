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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma.service");
let UserService = class UserService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async login(email, password) {
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: { roommateProfile: true },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (user.password !== password) {
            throw new common_1.UnauthorizedException('Invalid password');
        }
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                avatarUrl: user.avatarUrl,
                verificationStatus: user.verificationStatus,
                roommateProfile: user.roommateProfile,
            },
            token: user.id,
            _links: {
                profile: { href: '/v1/users/profile' },
                matches: { href: '/v1/roommates/matches' },
                groups: { href: '/v1/groups' },
                properties: { href: '/v1/properties/search' },
                notifications: { href: '/v1/notifications' },
            },
        };
    }
    async getDemoTenants() {
        const tenants = await this.prisma.user.findMany({
            where: { role: 'TENANT' },
            select: {
                id: true,
                email: true,
                name: true,
                avatarUrl: true,
                roommateProfile: {
                    select: { lifestyleTags: true, budgetMin: true, budgetMax: true, bio: true },
                },
            },
            orderBy: { name: 'asc' },
        });
        return {
            tenants,
            password: 'tenant123',
            _links: {
                login: { href: '/v1/auth/login', method: 'POST' },
            },
        };
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { roommateProfile: true },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return {
            ...user,
            password: undefined,
            _links: {
                self: { href: '/v1/users/profile' },
                matches: { href: '/v1/roommates/matches' },
                groups: { href: '/v1/groups' },
            },
        };
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
//# sourceMappingURL=user.service.js.map