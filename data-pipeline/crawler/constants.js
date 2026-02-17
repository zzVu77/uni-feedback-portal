// constants.js
const BADGES = [
  "Người đóng góp nhiều nhất",
  "Quản trị viên",
  "Thành viên mới",
  "Người bắt chuyện",
  "Chuyên gia kể chuyện",
  "Đạo diễn hình ảnh",
  "Người tham gia ẩn danh",
  "Tác giả",
  "Theo dõi",
  "Người tạo nội dung hàng đầu",
];

const STOP_KEYWORDS = [
  "Tất cả cảm xúc:",
  "bình luận",
  "lượt chia sẻ",
  "Thích",
  "Trả lời",
  "Chia sẻ",
  "Viết bình luận",
  "Xem thêm",
  "Phù hợp nhất",
  "Tất cả bình luận",
];

const DEFAULT_VIEWPORT = { width: 1366, height: 768 };
const DEFAULT_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36";

const AUTH_FILE = "auth.json";

module.exports = {
  BADGES,
  STOP_KEYWORDS,
  DEFAULT_VIEWPORT,
  DEFAULT_USER_AGENT,
  AUTH_FILE,
};
