import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class DepartmentProposalDto {
  @ApiProperty({
    description: 'Feedback description for department proposal',
    example: 'I have a question about my grades.',
  })
  @IsString()
  @MinLength(10)
  description: string;
}
