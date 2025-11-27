import { FileTargetType } from '@prisma/client';
import {
  CreateFileAttachmentDto,
  GenerateUploadUrlDto,
  GenerateUploadUrlResponseDto,
} from './dto';
import { FileAttachmentDto } from './dto/file-attachment.dto';

export interface UploadsServiceContract {
  generateUploadUrl(
    dto: GenerateUploadUrlDto,
  ): Promise<GenerateUploadUrlResponseDto>;

  getAttachmentsForTarget(
    targetId: string,
    targetType: FileTargetType,
  ): Promise<FileAttachmentDto[]>;

  getAttachmentsForManyTargets(
    targetIds: string[],
    targetType: FileTargetType,
  ): Promise<Record<string, FileAttachmentDto[]>>;

  updateAttachmentsForTarget(
    targetId: string,
    targetType: FileTargetType,
    newFiles: CreateFileAttachmentDto[],
  ): Promise<FileAttachmentDto[]>;

  deleteAttachmentsForTarget(
    targetId: string,
    targetType: FileTargetType,
  ): Promise<void>;
}
