import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { RoommateQueryService } from '../application/queries/roommate-query.service';
import { RoommateCommandService } from '../application/commands/roommate-command.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreatePollDto, VotePropertyDto } from '../dto/roommate.dto';
import { pollLinks } from '../../common/hateoas.helper';

/** Presentation Layer — Lab 3 Figure 3.4: Poll Controller */
@Controller('groups/:groupId/polls')
@UseGuards(AuthGuard, RolesGuard)
export class PollController {
  constructor(
    private readonly queries: RoommateQueryService,
    private readonly commands: RoommateCommandService,
  ) {}

  /** GET /v1/groups/:groupId/polls — Lab 3 Table 3.1 */
  @Get()
  @Roles('TENANT', 'ADMIN')
  getPolls(@Param('groupId') groupId: string) {
    return this.queries.getPolls(groupId);
  }

  /** POST /v1/groups/:groupId/polls — Lab 3 Use Case Steps 5-6: CreatePollCommand */
  @Post()
  @Roles('TENANT', 'ADMIN')
  async createPoll(
    @Param('groupId') groupId: string,
    @Body() dto: CreatePollDto,
    @CurrentUser() userId: string,
  ) {
    const poll = await this.commands.createPoll(groupId, dto.propertyId, userId);
    const data = JSON.parse(JSON.stringify(poll));
    return { ...data, _links: pollLinks(groupId, data.id, data.status) };
  }

  /** POST /v1/groups/:groupId/polls/:pollId/vote — Lab 3 Use Case Steps 7-8: VotePropertyCommand */
  @Post(':pollId/vote')
  @Roles('TENANT', 'ADMIN')
  async vote(
    @Param('groupId') groupId: string,
    @Param('pollId') pollId: string,
    @Body() dto: VotePropertyDto,
    @CurrentUser() userId: string,
  ) {
    const poll = await this.commands.voteOnPoll(groupId, pollId, dto.decision, userId);
    const data = JSON.parse(JSON.stringify(poll));
    return { ...data, _links: pollLinks(groupId, data.id, data.status) };
  }
}
