import { Module } from '@nestjs/common';
import { ModerationService } from './moderation.service';
import { ModerationController } from './moderation.controller';
// import { CommentModule } from '../comment/comment.module';
import { ForumModule } from '../forum/forum.module';
import { AnnouncementsModule } from '../announcements/announcements.module';

@Module({
  controllers: [ModerationController],
  providers: [ModerationService],
  // imports: [CommentModule, ForumModule, AnnouncementsModule],
  imports: [ForumModule, AnnouncementsModule],
})
export class ModerationModule {}
