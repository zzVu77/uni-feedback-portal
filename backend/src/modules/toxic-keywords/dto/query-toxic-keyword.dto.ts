import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryToxicKeywordDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;
}
