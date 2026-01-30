import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
export class CheckToxicDto {
    @ApiProperty({
        description: 'The content to be checked for toxicity'
    })
    @IsString()
    content: string;
}