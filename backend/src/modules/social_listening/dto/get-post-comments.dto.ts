import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class GetPostCommentsDto {
  @ApiPropertyOptional({ description: 'Số trang', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Số lượng comment mỗi trang',
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;

  @ApiPropertyOptional({
    description:
      'Lọc theo cảm xúc: Tiêu cực, Tích cực, Trung lập, Bức xúc, Stress lo âu',
  })
  @IsOptional()
  @IsString()
  sentimentLabel?: string;

  @ApiPropertyOptional({
    description: 'Lọc chỉ các bình luận nêu bằng chứng/bức xúc hàng đầu',
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  @IsBoolean()
  isTopConcern?: boolean;

  @ApiPropertyOptional({
    description:
      'Sắp xếp: reactions (nhiều tương tác nhất) hoặc date (mới nhất)',
    enum: ['reactions', 'date'],
    default: 'reactions',
  })
  @IsOptional()
  @IsIn(['reactions', 'date'])
  sortBy?: 'reactions' | 'date' = 'reactions';
}
