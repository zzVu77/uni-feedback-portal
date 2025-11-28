import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class NotificationParamDto {
  @ApiProperty({
    description: 'The ID of the notification (UUID)',
    type: String,
  })
  @IsUUID()
  id: string;
}
