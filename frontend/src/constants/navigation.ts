/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Bell,
  ChartColumn,
  History,
  LayoutDashboard,
  LayoutList,
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
  { href: "/student/my-feedbacks", label: "Lịch sử góp ý ", icon: History },
  {
    href: "/student/create-new-feedback",
    label: "Gửi góp ý",
    icon: MessageSquareText,
  },
  { href: "/forum", label: "Diễn đàn", icon: MessageCircle },
  { href: "/notifications", label: "Thông báo", icon: Bell },
];
export const staffNavigation: NavigationItem[] = [
  { href: "/staff/list-feedbacks", label: "Góp ý tiếp nhận", icon: History },
  { href: "/forum", label: "Diễn đàn", icon: MessageCircle },
  {
    href: "/staff/announcement-management",
    label: "Quản lý thông báo",
    icon: Megaphone,
  },
  { href: "/notifications", label: "Thông báo", icon: Bell },
  { href: "#6", label: "Thống kê", icon: ChartColumn },
  { href: "#4", label: "Tổng quan", icon: LayoutDashboard },
];
export const adminNavigation: NavigationItem[] = [
  {
    href: "/admin/feedbacks-management",
    label: "Góp ý tiếp nhận",
    icon: History,
  },
  {
    href: "/admin/reported-comment-management",
    label: "Quản lý bình luận vi phạm",
    icon: MessageSquareWarning,
  },
  {
    href: "/admin/category-management",
    label: "Quản lý danh mục",
    icon: LayoutList,
  },
  { href: "/forum", label: "Diễn đàn", icon: MessageCircle },
  { href: "/notifications", label: "Thông báo", icon: Bell },
  { href: "#6", label: "Thống kê", icon: ChartColumn },
  // { href: "#4", label: "Tổng quan", icon: LayoutDashboard },
  // { href: "#2", label: "Quản lý diễn đàn", icon: MessageCircle },
];
