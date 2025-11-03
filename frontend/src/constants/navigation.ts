/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
export type NavigationItem = {
  href: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};
export const studentNavigation: NavigationItem[] = [
  { href: "/notifications", label: "Thông báo", icon: Bell },
  {
    href: "/create-new-feedback",
    label: "Gửi góp ý",
    icon: MessageSquareText,
  },
  { href: "/my-feedbacks", label: "Lịch sử góp ý ", icon: History },
  { href: "/forum", label: "Diễn đàn", icon: MessageCircle },
];
export const staffNavigation: NavigationItem[] = [
  { href: "/notifications", label: "Thông báo", icon: Bell },
  { href: "/list-feedbacks", label: "Góp ý tiếp nhận", icon: History },
  { href: "/forum", label: "Diễn đàn", icon: MessageCircle },
  {
    href: "announcement-management",
    label: "Quản lý thông báo",
    icon: Megaphone,
  },
  { href: "#6", label: "Thống kê", icon: ChartColumn },
  { href: "#4", label: "Tổng quan", icon: LayoutDashboard },
];
export const adminNavigation: NavigationItem[] = [
  { href: "#3", label: "Thông báo", icon: Bell },
  { href: "#4", label: "Tổng quan", icon: LayoutDashboard },
  { href: "#1", label: "Góp ý tiếp nhận", icon: History },
  { href: "#2", label: "Quản lý diễn đàn", icon: MessageCircle },
  { href: "#7", label: "Quản lý bình luận", icon: MessageSquareWarning },
  { href: "#6", label: "Thống kê", icon: ChartColumn },
];
