import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('groups/:groupId/messages')
@UseGuards(AuthGuard)
export class MessageController {
  constructor(private readonly svc: MessageService) {}

  @Get()
  getMessages(@Param('groupId') groupId: string, @CurrentUser() userId: string) {
    return this.svc.getMessages(groupId, userId);
  }

  @Post()
  sendMessage(
    @Param('groupId') groupId: string,
    @CurrentUser() userId: string,
    @Body() body: { content: string },
  ) {
    return this.svc.sendMessage(groupId, userId, body.content);
  }
}
