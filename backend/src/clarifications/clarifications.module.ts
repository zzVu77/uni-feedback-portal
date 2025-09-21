import { Module } from '@nestjs/common';
import { ClarificationsService } from './clarifications.service';
import { ClarificationsController } from './clarifications.controller';

@Module({
  controllers: [ClarificationsController],
  providers: [ClarificationsService],
})
export class ClarificationsModule {}
