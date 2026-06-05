import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UploadsModule } from '../uploads/uploads.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [UploadsModule],
})
export class UsersModule {}
