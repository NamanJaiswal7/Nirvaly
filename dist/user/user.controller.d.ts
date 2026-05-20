import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            role: import(".prisma/client").$Enums.UserRole;
            avatarUrl: string | null;
            verificationStatus: string;
            roommateProfile: {
                id: string;
                createdAt: Date;
                userId: string;
                updatedAt: Date;
                city: string;
                lifestyleTags: string[];
                dealBreakers: string[];
                budgetMin: number;
                budgetMax: number;
                bio: string | null;
            } | null;
        };
        token: string;
        _links: {
            profile: {
                href: string;
            };
            matches: {
                href: string;
            };
            groups: {
                href: string;
            };
            properties: {
                href: string;
            };
            notifications: {
                href: string;
            };
        };
    }>;
    getDemoTenants(): Promise<{
        tenants: {
            roommateProfile: {
                lifestyleTags: string[];
                budgetMin: number;
                budgetMax: number;
                bio: string | null;
            } | null;
            id: string;
            name: string;
            email: string;
            avatarUrl: string | null;
        }[];
        password: string;
        _links: {
            login: {
                href: string;
                method: string;
            };
        };
    }>;
    getProfile(userId: string): Promise<{
        password: undefined;
        _links: {
            self: {
                href: string;
            };
            matches: {
                href: string;
            };
            groups: {
                href: string;
            };
        };
        roommateProfile: {
            id: string;
            createdAt: Date;
            userId: string;
            updatedAt: Date;
            city: string;
            lifestyleTags: string[];
            dealBreakers: string[];
            budgetMin: number;
            budgetMax: number;
            bio: string | null;
        } | null;
        id: string;
        createdAt: Date;
        name: string;
        email: string;
        phone: string | null;
        avatarUrl: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        verificationStatus: string;
        updatedAt: Date;
    }>;
}
