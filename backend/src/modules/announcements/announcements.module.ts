import { Module } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { AnnouncementsController } from './announcements.controller';
import { UploadsModule } from '../uploads/uploads.module';

@Module({
  imports: [UploadsModule], // Import UploadsModule để sử dụng UploadsService
  controllers: [AnnouncementsController],
  providers: [AnnouncementsService],
  exports: [AnnouncementsService], // Export service để các module khác (vd: Moderation) có thể dùng
})
export class AnnouncementsModule {}
