import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsUUID } from 'class-validator';
import { CreateForwardingDto } from './create-forwarding.dto';

export class BulkForwardFeedbackDto extends CreateForwardingDto {
  @ApiProperty({
    type: [String],
    description:
      'Feedback IDs to forward (same rules as single forward; out-of-scope IDs are skipped)',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  @IsUUID('loose', { each: true })
  feedbackIds: string[];
}
