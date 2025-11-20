import { Controller } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Uploads')
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  // Các endpoints cho việc tạo presigned URL và xóa file sẽ được thêm ở đây sau
}
