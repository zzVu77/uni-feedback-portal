import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FileTargetType } from '@prisma/client';
import {
  ALLOWED_FILE_TYPES,
  FileAttachmentDto,
  MAX_FILE_SIZE,
} from './dto/file-attachment.dto';
// import { createClient } from '@supabase/supabase-js';
import {
  GenerateUploadUrlDto,
  GenerateUploadUrlResponseDto,
  CreateFileAttachmentDto,
} from './dto';
import config from 'src/config/env.validation';
import { DeleteObjectCommand, PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { generateFileKey } from 'src/shared/helpers/generate-file-key';
import { generateFileUrl } from 'src/shared/helpers/genrate-file-url';

@Injectable()
export class UploadsService {
  private s3: S3;
  constructor(private readonly prisma: PrismaService) {
    this.s3 = new S3({
      region: config.AWS_REGION,
      // credentials: {
      //   accessKeyId: config.AWS_ACCESS_KEY,
      //   secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
      // },
    });
    this.s3
      .listBuckets()
      .then((data) => {
        console.log('Connected to AWS S3. Buckets:', data.Buckets);
      })
      .catch((error) => {
        console.error('Error connecting to AWS S3:', error);
      });
  }
  /**
   * Generates a pre-signed URL for uploading a file to AWS S3
   */
  async generateUploadUrl(
    dto: GenerateUploadUrlDto,
    userId: string,
  ): Promise<GenerateUploadUrlResponseDto> {
    const { fileName, fileType, fileSize, targetType } = dto;

    // ===== 1. Validate  backend  =====

    if (!ALLOWED_FILE_TYPES.includes(fileType)) {
      throw new BadRequestException('File type not allowed');
    }

    if (fileSize > MAX_FILE_SIZE) {
      throw new BadRequestException('File size exceeds limit');
    }

    // ===== 2. Generate object key =====
    const key = generateFileKey(userId, targetType, fileName);

    // ===== 3. Create PutObject command =====
    const command = new PutObjectCommand({
      Bucket: config.AWS_S3_BUCKET_NAME,
      Key: key,
      ContentType: fileType,
      ContentLength: fileSize,
    });

    // ===== 4. Generate presigned URL =====
    const uploadUrl = await getSignedUrl(this.s3, command, {
      expiresIn: 60,
    });
    // const fileUrl = uploadUrl.split('?')[0];
    return {
      uploadUrl,
      fileKey: key,
    };
  }

  async deleteFileFromS3(fileKey: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: config.AWS_S3_BUCKET_NAME,
        Key: fileKey,
      });
      await this.s3.send(command);
    } catch (error) {
      console.error(`Failed to delete S3 file: ${fileKey}`, error);
    }
  }

  async getAttachmentsForTarget(
    targetId: string,
    targetType: FileTargetType,
  ): Promise<FileAttachmentDto[]> {
    const attachments = await this.prisma.fileAttachments.findMany({
      where: {
        targetId,
        targetType,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return attachments.map((a) => ({
      id: a.id,
      fileName: a.fileName,
      fileKey: a.fileKey,
      fileUrl: generateFileUrl(a.fileKey, config.AWS_S3_BASE_URL),
      fileType: a.fileType,
      fileSize: a.fileSize,
    }));
  }

  async getAttachmentsForManyTargets(
    targetIds: string[],
    targetType: FileTargetType,
  ): Promise<Record<string, FileAttachmentDto[]>> {
    if (targetIds.length === 0) {
      return {};
    }

    const attachments = await this.prisma.fileAttachments.findMany({
      where: {
        targetId: { in: targetIds },
        targetType,
      },
    });

    const groupedByTargetId = attachments.reduce(
      (acc, attachment) => {
        const { targetId } = attachment;
        if (!acc[targetId]) {
          acc[targetId] = [];
        }
        acc[targetId].push({
          id: attachment.id,
          fileName: attachment.fileName,
          fileKey: attachment.fileKey,
          fileUrl: generateFileUrl(attachment.fileKey, config.AWS_S3_BASE_URL),
          fileType: attachment.fileType,
          fileSize: attachment.fileSize,
        });
        return acc;
      },
      {} as Record<string, FileAttachmentDto[]>,
    );

    return groupedByTargetId;
  }

  async updateAttachmentsForTarget(
    targetId: string,
    targetType: FileTargetType,
    newFiles: CreateFileAttachmentDto[],
  ): Promise<FileAttachmentDto[]> {
    const existingFiles = await this.getAttachmentsForTarget(
      targetId,
      targetType,
    );
    const newFileKeys = newFiles?.map((f) => f.fileKey) ?? [];

    const filesToDelete = existingFiles.filter(
      (f) => !newFileKeys.includes(f.fileKey),
    );

    const filesToAdd =
      newFiles?.filter(
        (f) => !existingFiles.some((e) => e.fileKey === f.fileKey),
      ) ?? [];

    if (filesToDelete.length > 0) {
      await Promise.all(
        filesToDelete.map((file) => this.deleteFileFromS3(file.fileKey)),
      );

      await this.prisma.fileAttachments.deleteMany({
        where: { id: { in: filesToDelete.map((f) => f.id) } },
      });
    }
    const keysAlreadyInDb = await this.getExistingFileKeys(
      filesToAdd.map((f) => f.fileKey),
    );
    if (keysAlreadyInDb.length > 0) {
      throw new ConflictException(
        `Some fileKeys already exist in the database`,
      );
    }
    if (filesToAdd.length > 0) {
      await this.prisma.fileAttachments.createMany({
        data: filesToAdd.map((file) => ({
          targetId,
          targetType,
          fileName: file.fileName,
          fileKey: file.fileKey,
          fileType: file.fileType,
          fileSize: file.fileSize,
        })),
      });
    }

    const finalFileKeys = newFileKeys ?? [];
    const finalFiles = await this.prisma.fileAttachments.findMany({
      where: {
        targetId,
        targetType,
        fileKey: { in: finalFileKeys },
      },
    });

    return finalFiles.map((a) => ({
      id: a.id,
      fileName: a.fileName,
      fileKey: a.fileKey,
      fileUrl: generateFileUrl(a.fileKey, config.AWS_S3_BASE_URL),
      fileType: a.fileType,
      fileSize: a.fileSize,
    }));
  }

  async deleteAttachmentsForTarget(
    targetId: string,
    targetType: FileTargetType,
  ) {
    const filesToDelete = await this.getAttachmentsForTarget(
      targetId,
      targetType,
    );

    if (filesToDelete.length > 0) {
      await Promise.all(
        filesToDelete.map((file) => this.deleteFileFromS3(file.fileKey)),
      );

      await this.prisma.fileAttachments.deleteMany({
        where: { targetId, targetType },
      });
    }
  }
  private async getExistingFileKeys(fileKeys: string[]): Promise<string[]> {
    if (!fileKeys.length) return [];

    const existingRecords = await this.prisma.fileAttachments.findMany({
      where: {
        fileKey: { in: fileKeys },
      },
      select: { fileKey: true },
    });

    return existingRecords.map((r) => r.fileKey);
  }
}
