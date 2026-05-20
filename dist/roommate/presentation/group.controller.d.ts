import { RoommateQueryService } from '../application/queries/roommate-query.service';
import { RoommateCommandService } from '../application/commands/roommate-command.service';
import { CreateGroupDto, AddMemberDto } from '../dto/roommate.dto';
export declare class GroupController {
    private readonly queries;
    private readonly commands;
    constructor(queries: RoommateQueryService, commands: RoommateCommandService);
    getMyGroups(userId: string): Promise<any[]>;
    createGroup(dto: CreateGroupDto, userId: string): Promise<any>;
    getGroup(id: string): Promise<{
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
    addMember(groupId: string, dto: AddMemberDto, userId: string): Promise<any>;
    submitApplication(groupId: string, body: {
        propertyId: string;
    }, userId: string): Promise<{
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
