import { ApiProperty } from '@nestjs/swagger';

export class KPIOverviewResponseDto {
  @ApiProperty({ example: 23 })
  totalPosts: number;

  @ApiProperty({ example: 450 })
  totalReactions: number;

  @ApiProperty({ example: 120 })
  totalComments: number;

  @ApiProperty({ example: 5 })
  negativePostsCount: number;

  @ApiProperty({ example: 'Tích cực' })
  dominantSentiment: string;

  @ApiProperty({ example: 'Chiếm 65% tổng số bài đăng' })
  sentimentTrendText: string;
}

export class SentimentTrendItemDto {
  @ApiProperty({ example: '2026-04-30' })
  dateStr: string;

  @ApiProperty({ example: '30/04' })
  displayDate: string;

  @ApiProperty({ example: 5 })
  positive: number;

  @ApiProperty({ example: 2 })
  negative: number;

  @ApiProperty({ example: 10 })
  neutral: number;
}

export class TopicDistributionItemDto {
  @ApiProperty({ example: 'Cơ sở vật chất' })
  topic: string;

  @ApiProperty({ example: 45 })
  count: number;
}
