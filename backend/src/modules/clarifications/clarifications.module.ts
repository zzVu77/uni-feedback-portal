import { Module } from '@nestjs/common';
import { ClarificationsService } from './clarifications.service';
import { ClarificationsController } from './clarifications.controller';
import { UploadsModule } from '../uploads/uploads.module';
import { ClarificationsGateway } from './clarifications.gateway';

@Module({
  imports: [UploadsModule], // Import UploadsModule để sử dụng UploadsService
  controllers: [ClarificationsController],
  providers: [ClarificationsService, ClarificationsGateway],
  exports: [ClarificationsGateway],
})
export class ClarificationsModule {}
