import { RoommateQueryService } from '../application/queries/roommate-query.service';
import { RoommateCommandService } from '../application/commands/roommate-command.service';
import { CreatePollDto, VotePropertyDto } from '../dto/roommate.dto';
export declare class PollController {
    private readonly queries;
    private readonly commands;
    constructor(queries: RoommateQueryService, commands: RoommateCommandService);
    getPolls(groupId: string): Promise<any[]>;
    createPoll(groupId: string, dto: CreatePollDto, userId: string): Promise<any>;
    vote(groupId: string, pollId: string, dto: VotePropertyDto, userId: string): Promise<any>;
}
