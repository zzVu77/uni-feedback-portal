import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FileTargetType } from '@prisma/client';
import { FileAttachmentDto } from './dto/file-attachment.dto';
import { CreateFileAttachmentDto } from './dto/create-file-attachment.dto';

@Injectable()
export class UploadsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Lấy danh sách file đính kèm cho một đối tượng.
   */
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
      fileUrl: a.fileUrl,
      fileType: a.fileType,
      fileSize: a.fileSize,
    }));
  }

  /**
   * Lấy danh sách file đính kèm cho nhiều đối tượng cùng lúc (tối ưu hóa query).
   * @param targetIds Mảng các ID của feedback, message, hoặc announcement
   * @param targetType Loại đối tượng
   * @returns Một Record với key là targetId và value là mảng các file đính kèm
   */
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

    // Gom nhóm các file theo targetId
    const groupedByTargetId = attachments.reduce(
      (acc, attachment) => {
        const { targetId } = attachment;
        if (!acc[targetId]) {
          acc[targetId] = [];
        }
        acc[targetId].push({
          id: attachment.id,
          fileName: attachment.fileName,
          fileUrl: attachment.fileUrl,
          fileType: attachment.fileType,
          fileSize: attachment.fileSize,
        });
        return acc;
      },
      {} as Record<string, FileAttachmentDto[]>,
    );

    return groupedByTargetId;
  }

  /**
   * Cập nhật (thêm/xóa) danh sách file đính kèm cho một đối tượng.
   */
  async updateAttachmentsForTarget(
    targetId: string,
    targetType: FileTargetType,
    newFiles: CreateFileAttachmentDto[],
  ) {
    const existingFiles = await this.getAttachmentsForTarget(
      targetId,
      targetType,
    );
    const newFileUrls = newFiles?.map((f) => f.fileUrl) ?? [];

    const filesToDelete = existingFiles.filter(
      (f) => !newFileUrls.includes(f.fileUrl),
    );

    const filesToAdd =
      newFiles?.filter(
        (f) => !existingFiles.some((e) => e.fileUrl === f.fileUrl),
      ) ?? [];

    // Xóa file cũ
    if (filesToDelete.length > 0) {
      // TODO: Logic xóa file trên S3 sẽ được thêm vào đây sau
      await this.prisma.fileAttachments.deleteMany({
        where: { id: { in: filesToDelete.map((f) => f.id) } },
      });
    }

    // Thêm file mới
    if (filesToAdd.length > 0) {
      await this.prisma.fileAttachments.createMany({
        data: filesToAdd.map((file) => ({
          targetId,
          targetType,
          fileName: file.fileName,
          fileUrl: file.fileUrl,
          fileType: file.fileType,
          fileSize: file.fileSize,
        })),
      });
    }
  }

  /**
   * Xóa tất cả file đính kèm của một đối tượng.
   */
  async deleteAttachmentsForTarget(
    targetId: string,
    targetType: FileTargetType,
  ) {
    const filesToDelete = await this.getAttachmentsForTarget(
      targetId,
      targetType,
    );

    if (filesToDelete.length > 0) {
      // TODO: Logic xóa file trên S3 sẽ được thêm vào đây sau
      await this.prisma.fileAttachments.deleteMany({
        where: { targetId, targetType },
      });
    }
  }
}
