import { RoommateRepository } from '../../infrastructure/roommate.repository';
export declare class RoommateQueryService {
    private repo;
    constructor(repo: RoommateRepository);
    getMatches(userId: string): Promise<{
        matchId: any;
        candidateId: any;
        candidateName: any;
        candidateAvatar: any;
        compatibilityScore: any;
        status: any;
        lifestyleTags: any;
        dealBreakers: any;
        budgetMin: any;
        budgetMax: any;
        bio: any;
        _links: {
            createGroup: {
                href: string;
                method: string;
            };
            existingGroups: {
                groupId: any;
                groupName: any;
                addMember: {
                    href: string;
                    method: string;
                };
            }[];
            self: {
                href: string;
            };
            like: {
                href: string;
                method: string;
            };
        };
    }[]>;
    getGroupById(groupId: string): Promise<{
        _links: Record<string, {
            href: string;
            method?: string;
        }>;
        members: ({
            user: {
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
            } & {
                id: string;
                createdAt: Date;
                name: string;
                email: string;
                password: string;
                phone: string | null;
                avatarUrl: string | null;
                role: import(".prisma/client").$Enums.UserRole;
                verificationStatus: string;
                updatedAt: Date;
            };
        } & {
            id: string;
            userId: string;
            groupId: string;
            joinedAt: Date;
        })[];
        polls: ({
            property: {
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
            };
            votes: ({
                user: {
                    id: string;
                    createdAt: Date;
                    name: string;
                    email: string;
                    password: string;
                    phone: string | null;
                    avatarUrl: string | null;
                    role: import(".prisma/client").$Enums.UserRole;
                    verificationStatus: string;
                    updatedAt: Date;
                };
            } & {
                id: string;
                createdAt: Date;
                userId: string;
                decision: import(".prisma/client").$Enums.VoteDecision;
                pollId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            groupId: string;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PollStatus;
            expiresAt: Date;
            propertyId: string;
        })[];
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.GroupStatus;
        adminId: string;
    }>;
    getGroupsForUser(userId: string): Promise<any[]>;
    getPolls(groupId: string): Promise<any[]>;
}
