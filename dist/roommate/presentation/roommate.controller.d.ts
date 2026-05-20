import { RoommateQueryService } from '../application/queries/roommate-query.service';
import { RoommateCommandService } from '../application/commands/roommate-command.service';
export declare class RoommateController {
    private readonly queries;
    private readonly commands;
    constructor(queries: RoommateQueryService, commands: RoommateCommandService);
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
    likeMatch(matchId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId1: string;
        userId2: string;
        compatibilityScore: number;
        status: import(".prisma/client").$Enums.MatchStatus;
    }>;
}
