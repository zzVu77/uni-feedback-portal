import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { ConfigModule } from '@nestjs/config';
import { UploadsController } from './uploads.controller';

@Module({
  imports: [ConfigModule], // Import ConfigModule để UploadsService có thể dùng
  providers: [UploadsService],
  exports: [UploadsService],
  controllers: [UploadsController], // Thêm controller
})
export class UploadsModule {}
