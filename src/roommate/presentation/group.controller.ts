import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { RoommateQueryService } from '../application/queries/roommate-query.service';
import { RoommateCommandService } from '../application/commands/roommate-command.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateGroupDto, AddMemberDto } from '../dto/roommate.dto';
import { groupLinks } from '../../common/hateoas.helper';

/** Presentation Layer — Lab 3 Figure 3.4: Group Controller */
@Controller('groups')
@UseGuards(AuthGuard, RolesGuard)
export class GroupController {
  constructor(
    private readonly queries: RoommateQueryService,
    private readonly commands: RoommateCommandService,
  ) {}

  /** GET /v1/groups — list my groups */
  @Get()
  @Roles('TENANT', 'ADMIN')
  getMyGroups(@CurrentUser() userId: string) {
    return this.queries.getGroupsForUser(userId);
  }

  /** POST /v1/groups — Lab 3 Use Case Step 2: CreateGroupCommand */
  @Post()
  @Roles('TENANT', 'ADMIN')
  async createGroup(@Body() dto: CreateGroupDto, @CurrentUser() userId: string) {
    const group = await this.commands.createGroup(dto.name, userId);
    const data = JSON.parse(JSON.stringify(group));
    return { ...data, _links: groupLinks(data.id, data.status) };
  }

  /** GET /v1/groups/:id — Lab 3 Table 3.1 */
  @Get(':id')
  @Roles('TENANT', 'ADMIN')
  getGroup(@Param('id') id: string) {
    return this.queries.getGroupById(id);
  }

  /** POST /v1/groups/:id/members — Lab 3 Use Case Step 3: AddMemberCommand */
  @Post(':id/members')
  @Roles('TENANT', 'ADMIN')
  async addMember(
    @Param('id') groupId: string,
    @Body() dto: AddMemberDto,
    @CurrentUser() userId: string,
  ) {
    const group = await this.commands.addMember(groupId, dto.userId, userId);
    const data = JSON.parse(JSON.stringify(group));
    return { ...data, _links: groupLinks(data.id, data.status) };
  }

  /** POST /v1/groups/:id/apply — per-property application */
  @Post(':id/apply')
  @Roles('TENANT', 'ADMIN')
  submitApplication(
    @Param('id') groupId: string,
    @Body() body: { propertyId: string },
    @CurrentUser() userId: string,
  ) {
    return this.commands.submitGroupApplication(groupId, body.propertyId, userId);
  }
}
