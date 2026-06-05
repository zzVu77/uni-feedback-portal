import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DataSourceStatus, Platform } from '@prisma/client';

export class SocialDataSourceDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  groupName: string;

  @ApiProperty({ enum: Platform })
  platform: Platform;

  @ApiPropertyOptional({ nullable: true })
  description?: string | null;

  @ApiProperty({ enum: DataSourceStatus })
  status: DataSourceStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class SocialDataSourceListResponseDto {
  @ApiProperty({ type: [SocialDataSourceDto] })
  results: SocialDataSourceDto[];

  @ApiProperty()
  total: number;
}
