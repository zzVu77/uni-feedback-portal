export const FeedbackStatus = [
  { label: "Trạng thái", value: "all" },
  { label: "Đang chờ tiếp nhận", value: "pending" },
  { label: "Đang xử lý", value: "in_progress" },
  { label: "Đã xử lý", value: "resolved" },
  { label: "Từ chối", value: "rejected" },
  { label: "Vi phạm", value: "violated_content" },
  { label: "Đang kiểm duyệt nội dung", value: "ai_reviewing" },
  { label: "Hệ thống kiểm duyệt gặp sự cố", value: "ai_review_failed" },
];
export const StaffFeedbackStatus = [
  { label: "Trạng thái", value: "all" },
  { label: "Đang chờ tiếp nhận", value: "pending" },
  { label: "Đang xử lý", value: "in_progress" },
  { label: "Đã xử lý", value: "resolved" },
  { label: "Từ chối", value: "rejected" },
];
export const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "text/plain", // .txt
];
