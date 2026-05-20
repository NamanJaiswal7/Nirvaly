import { PrismaService } from '../../common/prisma.service';
export declare class RoommateRepository {
    private prisma;
    constructor(prisma: PrismaService);
    findMatchesByUser(userId: string): import(".prisma/client").Prisma.PrismaPromise<({
        user1: {
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
        user2: {
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
        createdAt: Date;
        updatedAt: Date;
        userId1: string;
        userId2: string;
        compatibilityScore: number;
        status: import(".prisma/client").$Enums.MatchStatus;
    })[]>;
    findMatchById(id: string): import(".prisma/client").Prisma.Prisma__MatchClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId1: string;
        userId2: string;
        compatibilityScore: number;
        status: import(".prisma/client").$Enums.MatchStatus;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    updateMatchStatus(id: string, status: string): import(".prisma/client").Prisma.Prisma__MatchClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId1: string;
        userId2: string;
        compatibilityScore: number;
        status: import(".prisma/client").$Enums.MatchStatus;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    createGroup(name: string, adminId: string): import(".prisma/client").Prisma.Prisma__GroupClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findGroupById(id: string): import(".prisma/client").Prisma.Prisma__GroupClient<({
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
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    findGroupsByUser(userId: string): import(".prisma/client").Prisma.PrismaPromise<({
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
    updateGroupStatus(id: string, status: string): import(".prisma/client").Prisma.Prisma__GroupClient<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.GroupStatus;
        adminId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    addGroupMember(groupId: string, userId: string): import(".prisma/client").Prisma.Prisma__GroupMemberClient<{
        id: string;
        userId: string;
        groupId: string;
        joinedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findUserById(userId: string): import(".prisma/client").Prisma.Prisma__UserClient<{
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
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    createPoll(groupId: string, propertyId: string, expiresAt: Date): import(".prisma/client").Prisma.Prisma__PollClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findPollById(id: string): import(".prisma/client").Prisma.Prisma__PollClient<({
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
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    findPollsByGroup(groupId: string): import(".prisma/client").Prisma.PrismaPromise<({
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
    updatePollStatus(id: string, status: string): import(".prisma/client").Prisma.Prisma__PollClient<{
        id: string;
        createdAt: Date;
        groupId: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PollStatus;
        expiresAt: Date;
        propertyId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    createVote(pollId: string, userId: string, decision: string): import(".prisma/client").Prisma.Prisma__VoteClient<{
        id: string;
        createdAt: Date;
        userId: string;
        decision: import(".prisma/client").$Enums.VoteDecision;
        pollId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findVotesByPoll(pollId: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        userId: string;
        decision: import(".prisma/client").$Enums.VoteDecision;
        pollId: string;
    }[]>;
    findPropertyById(id: string): import(".prisma/client").Prisma.Prisma__PropertyClient<{
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
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
}
