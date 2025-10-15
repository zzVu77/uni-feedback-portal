import { ApiProperty } from '@nestjs/swagger';

// Summary of a single feedback for listing purposes
export class FeedbackSummary {
  @ApiProperty({ example: 101, description: 'Unique ID of the feedback' })
  feedbackId: number;

  @ApiProperty({
    example: 'Cannot log in to the system',
    description: 'Feedback subject or title',
  })
  subject: string;

  @ApiProperty({
    example: 'IN_PROGRESS',
    enum: ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'],
    description: 'Current status of the feedback',
  })
  currentStatus: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';

  @ApiProperty({
    example: false,
    description: 'Indicates if feedback is private',
  })
  isPrivate: boolean;

  @ApiProperty({
    example: {
      departmentId: 3,
      departmentName: 'Information Technology Department',
    },
    description: 'Department responsible for handling the feedback',
  })
  department: {
    departmentId: number;
    departmentName: string;
  };

  @ApiProperty({
    example: {
      categoryId: 2,
      categoryName: 'System Login Issues',
    },
    description: 'Category of the feedback',
  })
  category: {
    categoryId: number;
    categoryName: string;
  };

  @ApiProperty({
    example: '2025-10-15T10:00:00Z',
    description: 'Date and time when the feedback was created (ISO8601)',
  })
  createdAt: string;
}
// Response DTO for querying user's feedbacks with pagination
export class GetMyFeedbacksResponseDto {
  @ApiProperty({
    type: [FeedbackSummary],
    description: 'List of feedbacks submitted by the user',
  })
  results: FeedbackSummary[];

  @ApiProperty({ example: 45, description: 'Total number of feedbacks found' })
  total: number;
}

// Detailed response for a specific feedback, extending the summary
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
