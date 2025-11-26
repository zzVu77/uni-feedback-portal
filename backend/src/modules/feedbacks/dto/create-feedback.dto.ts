import {
  IsBoolean,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class AttachmentDto {
  @ApiProperty({
    example: 'screenshot.png',
    description: 'The name of the attached file uploaded by the user.',
  })
  @IsString()
  fileName: string;

  @ApiProperty({
    example: 'https://example.com/uploads/screenshot.png',
    description: 'The full URL path to access the uploaded attachment.',
  })
  @IsString()
  fileUrl: string;
}

export class CreateFeedbackDto {
  @ApiProperty({
    example: 'Unable to log into the system',
    description: 'The title or subject of the feedback.',
    minLength: 3,
  })
  @IsString()
  @MinLength(3)
  subject: string;

  @ApiPropertyOptional({
    description: 'A specific location related to the feedback (if applicable).',
    example: 'Main Campus Library, Building A',
  })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({
    example:
      'After resetting my password, I can no longer log in. Please assist as soon as possible.',
    description:
      'A detailed description of the issue or suggestion provided by the user.',
    minLength: 10,
  })
  @IsString()
  @MinLength(10)
  description: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440006',
    description:
      'The ID of the feedback category (linked to the Categories table).',
  })
  @IsString()
  categoryId: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440003',
    description: 'The ID of the department receiving the feedback.',
  })
  @IsString()
  departmentId: string;

  @ApiProperty({
    example: false,
    description:
      'Indicates whether the feedback is private (student info not show).',
  })
  @IsBoolean()
  isAnonymous: boolean;
  @ApiProperty({
    example: false,
    description: 'Indicates whether the feedback is public to forum.',
  })
  @IsBoolean()
  isPublic: boolean;
  @ApiPropertyOptional({
    description: 'A list of attached files (if any).',
    type: [AttachmentDto],
    example: [
      {
        fileName: 'error_screenshot.png',
        fileUrl: 'https://example.com/files/error_screenshot.png',
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  fileAttachments?: AttachmentDto[];
}
