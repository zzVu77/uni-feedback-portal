import { Module } from '@nestjs/common';
import { ForumService } from './forum.service';
import { ForumController } from './forum.controller';
import { CommentModule } from '../comment/comment.module';

@Module({
  controllers: [ForumController],
  providers: [ForumService],
  exports: [ForumService],
  imports: [CommentModule],
})
export class ForumModule {}
