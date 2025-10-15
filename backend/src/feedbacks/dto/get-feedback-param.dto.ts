import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { FeedbackSummary } from './query-my-feedbacks.dto';

export class GetFeedbackParamDto {
  @ApiProperty({
    example: 123,
    description: 'Unique ID of the feedback to retrieve details for',
    minimum: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  feedbackId: number;
}

export class GetFeedbackDetailResponse extends FeedbackSummary {
  @ApiProperty({
    example:
      'I cannot access my account after password reset. Please check my issue.',
    description: 'Detailed description of the feedback',
  })
  description: string;

  @ApiProperty({
    description: 'List of status changes for this feedback over time',
    example: [
      {
        status: 'PENDING',
        message: null,
        createdAt: '2025-10-15T10:00:00Z',
      },
      {
        status: 'IN_PROGRESS',
        message: 'Assigned to technical support',
        createdAt: '2025-10-16T09:30:00Z',
      },
    ],
  })
  statusHistory: Array<{
    status: string;
    message: string | null;
    createdAt: string;
  }>;

  @ApiProperty({
    description:
      'Records of how the feedback was forwarded between departments, including department names',
    example: [
      {
        forwardingLogId: 10,
        fromDepartment: {
          departmentId: 2,
          departmentName: 'Support',
        },
        toDepartment: {
          departmentId: 5,
          departmentName: 'Technical',
        },
        message: 'Forwarded to technical department for investigation',
        createdAt: '2025-10-15T14:00:00Z',
      },
    ],
  })
  forwardingLogs: Array<{
    forwardingLogId: number;
    fromDepartment: {
      departmentId: number;
      departmentName: string;
    };
    toDepartment: {
      departmentId: number;
      departmentName: string;
    };
    message: string | null;
    createdAt: string;
  }>;

  @ApiProperty({
    description: 'List of attached files related to the feedback',
    example: [
      {
        id: 1,
        fileName: 'screenshot.png',
        fileUrl: 'https://example.com/files/screenshot.png',
      },
    ],
  })
  fileAttachments: Array<{ id: number; fileName: string; fileUrl: string }>;
}
