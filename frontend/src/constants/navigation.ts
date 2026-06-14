/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Bell,
  ChartColumn,
  Ear,
  History,
  KeyRound,
  LayoutList,
  Megaphone,
  MessageCircle,
  MessageSquareText,
  MessageSquareWarning,
  Users,
  Building2,
  ShieldBan,
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
  { href: "/change-password", label: "Đổi mật khẩu", icon: KeyRound },
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
  { href: "/staff/dashboard", label: "Thống kê", icon: ChartColumn },
  {
    href: "/staff/social-listening",
    label: "Lắng nghe sinh viên",
    icon: Ear,
  },
  { href: "/change-password", label: "Đổi mật khẩu", icon: KeyRound },
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
    href: "/admin/keywords-management",
    label: "Quản lý từ khóa cấm",
    icon: ShieldBan,
  },
  {
    href: "/admin/category-management",
    label: "Quản lý danh mục",
    icon: LayoutList,
  },
  {
    href: "/admin/user-management",
    label: "Quản lý người dùng",
    icon: Users,
  },
  {
    href: "/admin/departments-management",
    label: "Quản lý phòng ban",
    icon: Building2,
  },
  { href: "/forum", label: "Diễn đàn", icon: MessageCircle },
  { href: "/notifications", label: "Thông báo", icon: Bell },
  { href: "/admin/dashboard", label: "Thống kê", icon: ChartColumn },
  {
    href: "/admin/social-listening",
    label: "Lắng nghe sinh viên",
    icon: Ear,
  },
  { href: "/change-password", label: "Đổi mật khẩu", icon: KeyRound },
];

export const staffAssistantNavigation: NavigationItem[] = [
  {
    href: "/staff-assistant/list-feedbacks",
    label: "Góp ý tiếp nhận",
    icon: History,
  },
  { href: "/forum", label: "Diễn đàn", icon: MessageCircle },
  {
    href: "/staff-assistant/announcement-management",
    label: "Quản lý thông báo",
    icon: Megaphone,
  },
  { href: "/notifications", label: "Thông báo", icon: Bell },
  { href: "/staff-assistant/dashboard", label: "Thống kê", icon: ChartColumn },
  {
    href: "/staff-assistant/social-listening",
    label: "Lắng nghe sinh viên",
    icon: Ear,
  },
  { href: "/change-password", label: "Đổi mật khẩu", icon: KeyRound },
];
