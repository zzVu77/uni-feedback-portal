import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SocialPost {
  @ApiProperty({
    example: '123456789_987654321',
    description: 'Unique ID of the Facebook post',
  })
  postId: string;

  @ApiProperty({ example: 'Nguyễn Văn A', description: 'Author of the post' })
  author: string;

  @ApiProperty({
    example: 'Wifi thư viện tầng 5 yếu quá admin ơi!',
    description: 'Original content of the post',
  })
  content: string;

  @ApiPropertyOptional({
    example: 'https://facebook.com/groups/utethacmachoctap/posts/123456789',
    description: 'URL link to the original Facebook post',
  })
  postLink: string | null;

  @ApiProperty({
    example: '2026-04-30T08:00:00.000Z',
    description: 'Timestamp when the post was published on Facebook',
  })
  postedAt: Date;

  @ApiProperty({
    example: 150,
    description: 'Number of reactions (likes, haha, sad, etc.)',
  })
  reactionCount: number;

  @ApiProperty({ example: 45, description: 'Number of comments on the post' })
  commentCount: number;

  @ApiProperty({
    example: 195,
    description: 'Total engagement score (reactions + comments)',
  })
  engagementScore: number;

  @ApiProperty({
    example: 'Cơ sở vật chất',
    description: 'AI-categorized topic of the post',
  })
  topic: string;

  @ApiProperty({
    example: -0.85,
    description:
      'Sentiment score ranging from -1.0 (Negative) to 1.0 (Positive)',
  })
  sentimentScore: number;

  @ApiProperty({
    example:
      'Sinh viên phàn nàn về chất lượng wifi tại thư viện trung tâm, ảnh hưởng đến việc học.',
    description: 'AI-generated summary of the post content',
  })
  aiSummary: string;

  @ApiProperty({
    example: 'Tiêu cực',
    description: 'Categorized sentiment label based on score',
  })
  sentimentLabel: string;

  @ApiProperty({
    example: '2026-04-30T08:15:00.000Z',
    description: 'Timestamp when the AI analyzed this post',
  })
  analyzedAt: Date;
}

export class TrendingIssuesResponseDto {
  @ApiProperty({
    type: () => [SocialPost],
    description: 'List of trending social posts matching the applied filters',
  })
  results: SocialPost[];

  @ApiProperty({
    example: 42,
    description: 'Total number of trending issues matching the filter criteria',
  })
  total: number;
}
