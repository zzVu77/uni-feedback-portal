import { v4 as uuidv4 } from 'uuid';
import { FileTargetType } from '@prisma/client'; // Import Enum từ Prisma của bạn

/**
 * Tạo S3 File Key theo cấu trúc Virtual Folder:
 * Format: userId/context/targetId/uuid-fileName
 */
export function generateFileKey(
  userId: string,
  targetType: FileTargetType,
  // targetId: string,
  fileName: string,
): string {
  // 1. Đưa targetType (Enum viết hoa) về chữ thường để đường dẫn đẹp hơn
  // VD: 'FEEDBACK' -> 'feedback'
  const context = targetType.toLowerCase();

  // 2. (Tùy chọn RẤT QUAN TRỌNG) Làm sạch tên file gốc
  // Tránh lỗi khi user upload file có dấu cách hoặc ký tự đặc biệt tiếng Việt
  // VD: "Anh Man Hinh.png" -> "anh-man-hinh.png"
  const safeFileName = fileName
    .trim()
    .replace(/\s+/g, '-') // Biến khoảng trắng thành dấu gạch ngang
    .toLowerCase(); // (Tùy chọn) đưa về chữ thường hết cho đồng nhất

  // 3. Tạo UUID để đảm bảo không bao giờ trùng lặp file
  const uniqueId = uuidv4();

  // 4. Nối chuỗi theo đúng format bạn yêu cầu
  // return `${userId}/${context}/${targetId}/${uniqueId}-${safeFileName}`;
  return `${context}/${userId}/${uniqueId}-${safeFileName}`;
}
