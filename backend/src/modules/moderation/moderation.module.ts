import { Module } from '@nestjs/common';
import { ModerationService } from './moderation.service';
import { ModerationController } from './moderation.controller';
import { CommentModule } from '../comment/comment.module';

@Module({
  controllers: [ModerationController],
  providers: [ModerationService],
  imports: [CommentModule],
})
export class ModerationModule {}
