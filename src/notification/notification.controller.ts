import { Controller, Get, Patch, Param, Post, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationController {
  constructor(private readonly svc: NotificationService) {}

  @Get()
  getNotifications(@CurrentUser() userId: string) {
    return this.svc.getForUser(userId);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string, @CurrentUser() userId: string) {
    return this.svc.markAsRead(id, userId);
  }

  @Post('read-all')
  markAllAsRead(@CurrentUser() userId: string) {
    return this.svc.markAllAsRead(userId);
  }
}
