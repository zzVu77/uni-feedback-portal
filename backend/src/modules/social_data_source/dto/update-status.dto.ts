import { ApiProperty } from '@nestjs/swagger';
import { DataSourceStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateDataSourceStatusDto {
  @ApiProperty({ enum: DataSourceStatus, description: 'The new status' })
  @IsNotEmpty()
  @IsEnum(DataSourceStatus)
  status: DataSourceStatus;
}
