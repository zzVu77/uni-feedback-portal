/**
 * Chuyển đổi fileKey từ Database thành fileUrl hoàn chỉnh để Frontend hiển thị.
 * Có xử lý chống lỗi "hai dấu gạch chéo" (double slash) hoặc lỗi lưu nhầm URL.
 */
export function generateFileUrl(fileKey: string, baseUrl: string): string {
  if (!fileKey) return ''; // Trả về chuỗi rỗng nếu không có key

  // CẢNH BÁO AN TOÀN:
  // Nếu vì lý do nào đó data cũ trong DB của bạn đang lưu full URL (http...),
  // thì trả về luôn để không bị nối chuỗi thành https://.../https://...
  if (fileKey.startsWith('http://') || fileKey.startsWith('https://')) {
    return fileKey;
  }

  // BƯỚC QUAN TRỌNG: Làm sạch chuỗi
  // 1. Xóa dấu '/' ở cuối baseUrl (nếu ai đó lỡ gõ dư trong file .env)
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');

  // 2. Xóa dấu '/' ở đầu fileKey (nếu có)
  const cleanKey = fileKey.replace(/^\//, '');

  // Nối lại bằng 1 dấu '/' duy nhất
  return `${cleanBaseUrl}/${cleanKey}`;
}
