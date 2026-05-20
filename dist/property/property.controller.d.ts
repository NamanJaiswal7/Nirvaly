import { PropertyService } from './property.service';
export declare class PropertyController {
    private readonly propertyService;
    constructor(propertyService: PropertyService);
    search(q?: string, city?: string, min?: string, max?: string): Promise<{
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
    getById(id: string): Promise<{
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
    getGroupPolls(id: string, userId: string): Promise<{
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
