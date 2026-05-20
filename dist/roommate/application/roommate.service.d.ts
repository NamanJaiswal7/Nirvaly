import { PrismaService } from '../../common/prisma.service';
import { CreateGroupDto, AddMemberDto, CreatePollDto, VotePropertyDto } from '../dto/roommate.dto';
export declare class RoommateService {
    private prisma;
    constructor(prisma: PrismaService);
    getMatches(userId: string): Promise<{
        matchId: string;
        candidateId: string;
        candidateName: string;
        candidateAvatar: string | null;
        compatibilityScore: number;
        status: import(".prisma/client").$Enums.MatchStatus;
        lifestyleTags: string[];
        dealBreakers: string[];
        budgetMin: number;
        budgetMax: number;
        bio: string;
    }[]>;
    likeMatch(matchId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId1: string;
        userId2: string;
        compatibilityScore: number;
        status: import(".prisma/client").$Enums.MatchStatus;
    }>;
    createGroup(dto: CreateGroupDto, adminId: string): Promise<{
        members: ({
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
            userId: string;
            groupId: string;
            joinedAt: Date;
        })[];
    } & {
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.GroupStatus;
        adminId: string;
    }>;
    getGroupById(groupId: string): Promise<{
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
            votes: {
                id: string;
                createdAt: Date;
                userId: string;
                decision: import(".prisma/client").$Enums.VoteDecision;
                pollId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            groupId: string;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PollStatus;
            expiresAt: Date;
            propertyId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.GroupStatus;
        adminId: string;
    }>;
    getGroupsForUser(userId: string): Promise<({
        _count: {
            polls: number;
        };
        members: ({
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
            userId: string;
            groupId: string;
            joinedAt: Date;
        })[];
    } & {
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.GroupStatus;
        adminId: string;
    })[]>;
    addMember(groupId: string, dto: AddMemberDto, requesterId: string): Promise<{
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
            votes: {
                id: string;
                createdAt: Date;
                userId: string;
                decision: import(".prisma/client").$Enums.VoteDecision;
                pollId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            groupId: string;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PollStatus;
            expiresAt: Date;
            propertyId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.GroupStatus;
        adminId: string;
    }>;
    createPoll(groupId: string, dto: CreatePollDto, userId: string): Promise<{
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
        votes: {
            id: string;
            createdAt: Date;
            userId: string;
            decision: import(".prisma/client").$Enums.VoteDecision;
            pollId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        groupId: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PollStatus;
        expiresAt: Date;
        propertyId: string;
    }>;
    getPolls(groupId: string): Promise<({
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
    })[]>;
    voteOnPoll(groupId: string, pollId: string, dto: VotePropertyDto, userId: string): Promise<({
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
    }) | null>;
    submitGroupApplication(groupId: string, userId: string): Promise<{
        groupId: string;
        groupName: string;
        status: string;
        members: {
            userId: string;
            name: string;
            budgetMin: number;
            budgetMax: number;
        }[];
        totalBudgetMin: number;
        totalBudgetMax: number;
        appliedPropertyId: string;
    }>;
}
