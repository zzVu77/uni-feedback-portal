import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SocialListeningService } from './social_listening.service';
import { SocialListeningController } from './social_listening.controller';
import { GithubActionModule } from '../github-action/github-action.module';

@Module({
  imports: [ConfigModule, GithubActionModule],
  controllers: [SocialListeningController],
  providers: [SocialListeningService],
  exports: [SocialListeningService],
})
export class SocialListeningModule {}
