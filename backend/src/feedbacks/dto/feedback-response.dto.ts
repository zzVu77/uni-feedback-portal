import { ApiProperty, OmitType } from '@nestjs/swagger';
import { FeedbackStatus } from '@prisma/client';

export class FeedbackDetail {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-44665544001c',
    description: 'Unique ID of the feedback',
  })
  id: string;

  @ApiProperty({
    example: 'Cannot log in to the system',
    description: 'Feedback subject or title',
  })
  subject: string;
  @ApiProperty({
    example: 'Room 101, Main Building',
    description: 'Location where the feedback was observed',
  })
  location?: string | null;
  @ApiProperty({
    example: 'IN_PROGRESS',
    enum: FeedbackStatus,
    description: 'Current status of the feedback',
  })
  currentStatus: FeedbackStatus;

  @ApiProperty({
    example: false,
    description: 'Indicates if feedback is private',
  })
  isPrivate: boolean;

  @ApiProperty({
    example: {
      id: '550e8400-e29b-41d4-a716-44665544001c',
      name: 'Information Technology Department',
    },
    description: 'Department responsible for handling the feedback',
  })
  department: {
    id: string;
    name: string;
  };

  @ApiProperty({
    example: {
      id: '550e8400-e29b-41d4-a716-44665544001c',
      name: 'System Login Issues',
    },
    description: 'Category of the feedback',
  })
  category: {
    id: string;
    name: string;
  };

  @ApiProperty({
    example: '2025-10-15T10:00:00Z',
    description: 'Date and time when the feedback was created (ISO8601)',
  })
  createdAt: string;

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
        message: 'Feedback has been successfully submitted to the department',
        note: 'Lighting issue reported',
        createdAt: '2025-10-15T10:00:00Z',
      },
      {
        status: 'IN_PROGRESS',
        message: 'Feedback is being processed by the department',
        note: 'Lighting issue reported',
        createdAt: '2025-10-16T09:30:00Z',
      },
    ],
  })
  statusHistory: Array<{
    status: string;
    message: string;
    note: string | null;
    createdAt: string;
  }>;

  @ApiProperty({
    description:
      'Records of how the feedback was forwarded between departments, including department names',
    example: [
      {
        id: '550e8400-e29b-41d4-a716-44665544001c',
        fromDepartment: {
          id: 2,
          name: 'Support',
        },
        toDepartment: {
          id: '550e8400-e29b-41d4-a716-44665544002c',
          name: 'Technical',
        },
        message: 'Forwarded to technical department for investigation',
        createdAt: '2025-10-15T14:00:00Z',
      },
    ],
  })
  forwardingLogs: Array<{
    id: string;
    fromDepartment: { id: string; name: string };
    toDepartment: { id: string; name: string };
    message: string | null;
    createdAt: string;
  }>;

  @ApiProperty({
    description: 'List of attached files related to the feedback',
    example: [
      {
        id: '550e8400-e29b-41d4-a716-44665544001c',
        fileName: 'screenshot.png',
        fileUrl: 'https://example.com/files/screenshot.png',
      },
    ],
  })
  fileAttachments: Array<{ id: string; fileName: string; fileUrl: string }>;
}

export class FeedbackSummary extends OmitType(FeedbackDetail, [
  'description',
  'statusHistory',
  'forwardingLogs',
  'fileAttachments',
] as const) {}
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
