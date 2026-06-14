import { Module } from '@nestjs/common';
import { ToxicKeywordsService } from './toxic-keywords.service';
import { ToxicKeywordsController } from './toxic-keywords.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ToxicKeywordsController],
  providers: [ToxicKeywordsService],
})
export class ToxicKeywordsModule {}
