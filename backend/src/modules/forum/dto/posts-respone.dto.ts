import { ApiProperty, OmitType } from '@nestjs/swagger';
import { FeedbackDetail } from 'src/modules/feedbacks/dto';
export class FeedbackForumDto extends OmitType(FeedbackDetail, [
  'statusHistory',
  // 'forwardingLogs',
  'createdAt',
] as const) {
  @ApiProperty({
    description: 'Response from office handling the feedback',
    example: 'This feedback has been processed by IT department.',
    required: false,
  })
  officeResponse?: string;
}

export class FeedbackForumSummaryDto extends OmitType(FeedbackForumDto, [
  'fileAttachments',
] as const) {}
class UserInfo {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-44665544001c' })
  id: string;

  @ApiProperty({ example: 'Nguyen Van A', nullable: true })
  fullName: string | null;

  @ApiProperty({ example: 'a@student.edu.vn' })
  email: string;
}
export class PostDetailDto {
  @ApiProperty({
    description: 'Unique identifier of the post',
    example: '550e8400-e29b-41d4-a716-446655440009',
  })
  id: string;

  @ApiProperty({
    description: 'Timestamp when the post was created (ISO string)',
    example: '2025-09-26T08:45:00.000Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Feedback information attached to this post',
    type: FeedbackForumDto,
  })
  feedback: FeedbackForumDto;
  @ApiProperty({
    description: 'Information about the user who created the post',
    type: UserInfo,
  })
  user?: UserInfo | null;

  @ApiProperty({
    description: 'Total number of votes',
    example: 87,
  })
  votes: number;

  @ApiProperty({
    description: 'Indicates whether the current user has voted',
    example: true,
  })
  hasVoted: boolean;
}

export class PostSummaryDto extends OmitType(PostDetailDto, [
  'feedback',
] as const) {
  @ApiProperty({ type: FeedbackForumSummaryDto })
  feedback: FeedbackForumSummaryDto;

  @ApiProperty({ example: 10 })
  commentsCount: number;
}

export class GetPostsResponseDto {
  @ApiProperty({ type: [PostSummaryDto] })
  results: PostSummaryDto[];
  @ApiProperty({
    example: 100,
    description: 'Total post for pagination',
  })
  total: number;
}

export class VoteResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  postId: string;

  @ApiProperty({
    example: true,
    description: 'Indicates if the current user has voted',
  })
  isVoted: boolean;

  @ApiProperty({
    example: 42,
    description: 'Total number of votes for this post',
  })
  totalVotes: number;
}
