import { Module } from '@nestjs/common';
import { RoommateModule } from './roommate/roommate.module';
import { PropertyModule } from './property/property.module';
import { UserModule } from './user/user.module';
import { NotificationModule } from './notification/notification.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    RoommateModule,
    PropertyModule,
    UserModule,
    NotificationModule,
    MessageModule,
  ],
})
export class AppModule {}
