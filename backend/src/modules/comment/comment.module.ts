import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { AnnouncementsModule } from '../announcements/announcements.module';

@Module({
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
  imports: [AnnouncementsModule],
})
export class CommentModule {}
