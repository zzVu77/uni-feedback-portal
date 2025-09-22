import { DeleteFileDto } from './dto/delete-file.dto';
import { UploadFileResponseDto } from './dto/upload-file.dto';

export interface UploadsServiceContract {
  upload(
    // file: Express.Multer.File,
    user_id: number,
  ): Promise<UploadFileResponseDto>;
  delete(
    dto: DeleteFileDto,
    actor: { user_id: number; role: 'Student' | 'DepartmentStaff' | 'Admin' },
  ): Promise<{ success: true }>;
}
