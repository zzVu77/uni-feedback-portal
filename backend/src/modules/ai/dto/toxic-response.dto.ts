import { ApiProperty } from '@nestjs/swagger';
export class ToxicResponseDto {
    @ApiProperty({
        description: 'Indicates whether the content is toxic or not'
    })
    isToxic: boolean;
}