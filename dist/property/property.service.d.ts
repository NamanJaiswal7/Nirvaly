import { PrismaService } from '../common/prisma.service';
export declare class PropertyService {
    private prisma;
    constructor(prisma: PrismaService);
    searchProperties(query?: string, city?: string, minPrice?: number, maxPrice?: number): Promise<{
        _links: {
            shareToGroup: {
                href: string;
                method: string;
            };
            self: {
                href: string;
            };
            search: {
                href: string;
            };
            groupPolls: {
                href: string;
            };
        };
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        city: string;
        address: string;
        price: number;
        rooms: number;
        area: number | null;
        features: string[];
        images: string[];
        landlordId: string;
        isVerified: boolean;
    }[]>;
    getPropertyById(id: string): Promise<{
        _links: {
            shareToGroup: {
                href: string;
                method: string;
            };
            self: {
                href: string;
            };
            search: {
                href: string;
            };
            groupPolls: {
                href: string;
            };
        };
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        city: string;
        address: string;
        price: number;
        rooms: number;
        area: number | null;
        features: string[];
        images: string[];
        landlordId: string;
        isVerified: boolean;
    }>;
    getPropertyGroupPolls(propertyId: string, userId: string): Promise<{
        pollId: any;
        groupId: any;
        groupName: any;
        groupAdminId: any;
        status: any;
        totalMembers: any;
        totalVotes: any;
        allLiked: boolean;
        canApply: boolean;
        _links: {
            vote: {
                href: string;
                method: string;
            } | null;
            apply: {
                href: string;
                method: string;
            } | null;
            group: {
                href: string;
            };
        };
    }[]>;
}
