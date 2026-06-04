import { Module } from '@nestjs/common';
import { SocialDataSourceService } from './social_data_source.service';
import { SocialDataSourceController } from './social_data_source.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SocialDataSourceController],
  providers: [SocialDataSourceService],
})
export class SocialDataSourceModule {}
