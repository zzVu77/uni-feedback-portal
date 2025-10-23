import {
  Bell,
  ChartColumn,
  History,
  LayoutDashboard,
  Megaphone,
  MessageCircle,
  MessageSquareText,
  MessageSquareWarning,
} from "lucide-react";

export const studentNavigation = [
  { href: "#3", label: "Thông báo", icon: Bell },
  { href: "/create-new-feedback", label: "Gửi góp ý", icon: MessageSquareText },
  { href: "/my-feedbacks", label: "Lịch sử góp ý ", icon: History },
  { href: "#2", label: "Diễn đàn", icon: MessageCircle },
];
export const staffNavigation = [
  { href: "#3", label: "Thông báo", icon: Bell },
  { href: "#4", label: "Tổng quan", icon: LayoutDashboard },
  { href: "#1", label: "Góp ý tiếp nhận", icon: History },
  { href: "#2", label: "Diễn đàn", icon: MessageCircle },
  { href: "#5", label: "Quản lý bài đăng", icon: Megaphone },
  { href: "#6", label: "Thống kê", icon: ChartColumn },
];
export const adminNavigation = [
  { href: "#3", label: "Thông báo", icon: Bell },
  { href: "#4", label: "Tổng quan", icon: LayoutDashboard },
  { href: "#1", label: "Góp ý tiếp nhận", icon: History },
  { href: "#2", label: "Quản lý diễn đàn", icon: MessageCircle },
  { href: "#7", label: "Quản lý bình luận", icon: MessageSquareWarning },
  { href: "#6", label: "Thống kê", icon: ChartColumn },
];
