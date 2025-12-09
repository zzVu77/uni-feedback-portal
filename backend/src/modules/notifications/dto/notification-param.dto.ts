import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class NotificationParamDto {
  @ApiProperty({
    description: 'The ID of the notification (UUID)',
    type: String,
  })
  // @IsUUID()
  @IsString()
  id: string;
}
