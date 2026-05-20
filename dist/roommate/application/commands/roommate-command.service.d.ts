import { RoommateRepository } from '../../infrastructure/roommate.repository';
import { NotificationService } from '../../../notification/notification.service';
import { MessageService } from '../../../message/message.service';
export declare class RoommateCommandService {
    private repo;
    private notifications;
    private messages;
    constructor(repo: RoommateRepository, notifications: NotificationService, messages: MessageService);
    likeMatch(matchId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId1: string;
        userId2: string;
        compatibilityScore: number;
        status: import(".prisma/client").$Enums.MatchStatus;
    }>;
    createGroup(name: string, adminId: string): Promise<{
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
    addMember(groupId: string, userId: string, requesterId: string): Promise<({
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
    } & {
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.GroupStatus;
        adminId: string;
    }) | null>;
    createPoll(groupId: string, propertyId: string, userId: string): Promise<{
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
    voteOnPoll(groupId: string, pollId: string, decision: string, userId: string): Promise<({
        group: {
            members: {
                id: string;
                userId: string;
                groupId: string;
                joinedAt: Date;
            }[];
        } & {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.GroupStatus;
            adminId: string;
        };
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
    submitGroupApplication(groupId: string, propertyId: string, userId: string): Promise<{
        groupId: string;
        groupName: string;
        status: string;
        propertyId: string;
        property: {
            id: string;
            title: string;
            price: number;
            address: string;
        } | null;
        members: {
            userId: any;
            name: any;
            email: any;
            budgetMin: any;
            budgetMax: any;
            lifestyleTags: any;
        }[];
        totalBudgetMin: any;
        totalBudgetMax: any;
        submittedAt: string;
        _links: {
            group: {
                href: string;
            };
            property: {
                href: string;
            };
        };
    }>;
}
