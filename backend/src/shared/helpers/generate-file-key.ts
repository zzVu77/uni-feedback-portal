import { v4 as uuidv4 } from 'uuid';
import { FileTargetType } from '@prisma/client'; // Import Enum from your Prisma

/**
 * Create S3 File Key according to Virtual Folder structure:
 * Format: userId/context/targetId/uuid-fileName
 */
export function generateFileKey(
  userId: string,
  targetType: FileTargetType,
  // targetId: string,
  fileName: string,
): string {
  // 1. Convert targetType (uppercase Enum) to lowercase for a cleaner path
  // EG: 'FEEDBACK' -> 'feedback'
  const context = targetType.toLowerCase();

  // 2. (VERY IMPORTANT option) Clean up the original file name
  // Avoid errors when users upload files with spaces or special Vietnamese characters
  // EG: "Anh Man Hinh.png" -> "anh-man-hinh.png"
  const safeFileName = fileName.trim().replace(/\s+/g, '-').toLowerCase();

  // 3. Create UUID to ensure file is always unique
  const uniqueId = uuidv4();

  // 4. Concatenate the string in the format you requested
  // return `${userId}/${context}/${targetId}/${uniqueId}-${safeFileName}`;
  return `${context}/${userId}/${uniqueId}-${safeFileName}`;
}
