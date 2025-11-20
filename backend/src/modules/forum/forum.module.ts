import { Module } from '@nestjs/common';
import { ForumService } from './forum.service';
import { ForumController } from './forum.controller';
import { CommentModule } from '../comment/comment.module';
import { UploadsModule } from '../uploads/uploads.module';

@Module({
  controllers: [ForumController],
  providers: [ForumService],
  exports: [ForumService],
  imports: [CommentModule, UploadsModule],
})
export class ForumModule {}
