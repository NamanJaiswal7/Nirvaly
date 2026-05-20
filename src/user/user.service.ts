import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  /** POST /v1/auth/login — mock Firebase Auth login */
  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { roommateProfile: true },
    });
    if (!user) throw new NotFoundException('User not found');
    if (user.password !== password) {
      throw new UnauthorizedException('Invalid password');
    }
    // Mock token = userId (in production: Firebase ID token)
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

  /** GET /v1/auth/tenants — list demo tenants for login screen */
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

  /** GET /v1/users/profile */
  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { roommateProfile: true },
    });
    if (!user) throw new NotFoundException('User not found');
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
}
