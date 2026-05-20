import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';

@Module({
  imports: [CommonModule],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
