import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { RoommateQueryService } from '../application/queries/roommate-query.service';
import { RoommateCommandService } from '../application/commands/roommate-command.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

/** Presentation Layer — Lab 3 Figure 3.4: Roommate Controller */
@Controller('roommates')
@UseGuards(AuthGuard, RolesGuard)
export class RoommateController {
  constructor(
    private readonly queries: RoommateQueryService,
    private readonly commands: RoommateCommandService,
  ) {}

  /** GET /v1/roommates/matches — Lab 3 Table 3.1 */
  @Get('matches')
  @Roles('TENANT', 'ADMIN')
  getMatches(@CurrentUser() userId: string) {
    return this.queries.getMatches(userId);
  }

  /** POST /v1/roommates/matches/:id/like — Lab 3 Table 3.1 */
  @Post('matches/:id/like')
  @Roles('TENANT', 'ADMIN')
  likeMatch(@Param('id') matchId: string, @CurrentUser() userId: string) {
    return this.commands.likeMatch(matchId, userId);
  }
}
