import { ApiProperty } from '@nestjs/swagger';
import { FeedbackSummary } from '../../feedbacks/dto/feedback-response.dto';
class StudentInfo {
  @ApiProperty({ example: 12 })
  userId: number;

  @ApiProperty({ example: 'Nguyen Van A', nullable: true })
  fullName: string | null;

  @ApiProperty({ example: 'a@student.edu.vn' })
  email: string;
}

export class ListFeedbacksResponseDto {
  @ApiProperty({
    type: () => [FeedbackSummary],
    description: 'List of feedbacks with optional student info',
  })
  items: (FeedbackSummary & { student?: StudentInfo })[];

  @ApiProperty({ example: 42, description: 'Total number of feedbacks' })
  total: number;
}
