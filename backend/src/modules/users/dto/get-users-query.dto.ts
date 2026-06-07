import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole, UserStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export enum UserOrderBy {
  VIOLATION_COUNT_DESC = 'violationCount_desc',
  VIOLATION_COUNT_ASC = 'violationCount_asc',
  CREATED_AT_DESC = 'createdAt_desc',
}

export class GetUsersQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ example: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Search by full name or email' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ enum: UserRole })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiPropertyOptional({ enum: UserStatus })
  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;

  @ApiPropertyOptional({ description: 'Department ID' })
  @IsString()
  @IsOptional()
  departmentId?: string;

  @ApiPropertyOptional({
    description: 'Number of days for the rolling time window',
    default: 30,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  lookbackDays?: number = 30;

  @ApiPropertyOptional({
    description: 'Order by field',
    enum: UserOrderBy,
    default: UserOrderBy.CREATED_AT_DESC,
    example: UserOrderBy.VIOLATION_COUNT_DESC,
  })
  @IsEnum(UserOrderBy)
  @IsOptional()
  orderBy?: UserOrderBy = UserOrderBy.CREATED_AT_DESC;
}
