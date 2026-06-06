import { Module } from '@nestjs/common';
import { GithubActionController } from './github-action.controller';
import { GithubActionService } from './github-action.service';

@Module({
  controllers: [GithubActionController],
  providers: [GithubActionService],
})
export class GithubActionModule {}
