import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { NotificationModule } from '../notification/notification.module';
import { MessageModule } from '../message/message.module';
import { RoommateRepository } from './infrastructure/roommate.repository';
import { RoommateQueryService } from './application/queries/roommate-query.service';
import { RoommateCommandService } from './application/commands/roommate-command.service';
import { RoommateController } from './presentation/roommate.controller';
import { GroupController } from './presentation/group.controller';
import { PollController } from './presentation/poll.controller';

/**
 * Roommate Module — Lab 2 Table 2.3: Roommate Service
 * Architecture: Lab 3 Figure 3.4 (Clean Architecture + CQRS)
 */
@Module({
  imports: [CommonModule, NotificationModule, MessageModule],
  controllers: [RoommateController, GroupController, PollController],
  providers: [
    RoommateRepository,
    RoommateQueryService,
    RoommateCommandService,
  ],
})
export class RoommateModule {}
