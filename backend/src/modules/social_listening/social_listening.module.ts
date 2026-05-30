import { Module } from '@nestjs/common';
import { SocialListeningService } from './social_listening.service';
import { SocialListeningController } from './social_listening.controller';

@Module({
  controllers: [SocialListeningController],
  providers: [SocialListeningService],
})
export class SocialListeningModule {}
