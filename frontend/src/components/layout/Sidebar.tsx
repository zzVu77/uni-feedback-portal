"use client";
import { Button } from "@/components/ui/button";
import { ASSETS } from "@/constants/assets";
import {
  adminNavigation,
  NavigationItem,
  staffNavigation,
  studentNavigation,
} from "@/constants/navigation";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useLogout } from "@/hooks/queries/useAuthenticationQueries";
import { useUser } from "@/context/UserContext";
import { getRoleDisplayName } from "@/utils/getRoleDisplayName";
import { useGetUnreadNotificationCount } from "@/hooks/queries/useNotificationQueries";
import { ScrollArea } from "../ui/scroll-area";

type SidebarProps = {
  showOnMobile?: boolean;
  type?: "student" | "staff" | "admin";
  fullName?: string;
};

export default function Sidebar({
  showOnMobile = false,
  type = "student",
  fullName,
}: SidebarProps) {
  let navigation: NavigationItem[];
  const pathname = usePathname();

  const { data: unreadCount } = useGetUnreadNotificationCount();

  switch (type) {
    case "student":
      navigation = studentNavigation;
      break;
    case "staff":
      navigation = staffNavigation;
      break;
    case "admin":
      navigation = adminNavigation;
      break;
    default:
      navigation = studentNavigation;
  }
  const { mutateAsync: logout, isPending } = useLogout();
  const { setUser } = useUser();

  return (
    <div
      className={cn(
        "h-screen w-64 flex-col border-r border-slate-800 bg-slate-900 text-white transition-all",
        showOnMobile ? "flex w-full" : "hidden lg:flex",
      )}
    >
      <div className="flex flex-shrink-0 items-center justify-center border-b border-slate-800 px-6 py-8">
        <Image
          src={ASSETS.LOGO_UTE}
          alt="Logo UTE"
          height={100}
          width={100}
          className=""
        />
      </div>
      <div className="flex flex-shrink-0 flex-row items-center gap-3 px-6 py-4">
        <Avatar className="h-10 w-10 border border-slate-700">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback className="bg-slate-800 text-slate-200">
            CN
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="max-w-[140px] truncate text-sm font-semibold text-white">
            {fullName}
          </span>
          <span className="text-xs font-medium text-slate-400">
            {getRoleDisplayName(type)}
          </span>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col border-t border-slate-800">
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-1 px-3 py-4">
            {navigation.map(({ href, label, icon: Icon }) => {
              const isNotificationItem = href === "/notifications";
              const isActive = pathname === href;
              const showBadge =
                isNotificationItem &&
                unreadCount &&
                unreadCount.unreadCount > 0;
              const displayCount =
                unreadCount && unreadCount.unreadCount > 99
                  ? "99+"
                  : unreadCount?.unreadCount;

              return (
                <Link key={href} href={href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "h-auto w-full justify-start px-4 py-3 text-[13px] transition-all duration-200 lg:text-[14px]",
                      isActive
                        ? "rounded-md bg-white/10 font-semibold text-white shadow-sm hover:bg-white/10 hover:text-white"
                        : "rounded-md text-slate-400 hover:bg-white/5 hover:text-white",
                    )}
                  >
                    <Icon className={cn("mr-3 h-4 w-4")} />
                    {label}

                    {/* Hiển thị Badge nếu là item thông báo và có số lượng > 0 */}
                    {showBadge && (
                      <span
                        className={cn(
                          "ml-auto flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-bold text-white",
                          isActive ? "bg-red-500" : "bg-red-600",
                        )}
                      >
                        {displayCount}
                      </span>
                    )}
                  </Button>
                </Link>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      <div className="flex-shrink-0 border-t border-slate-800 p-4">
        <Button
          onClick={async () => {
            await logout().then(() => {
              setUser(null);
            });
          }}
          disabled={isPending}
          variant="ghost"
          className="h-auto w-full justify-start rounded-md px-4 py-3 text-slate-400 transition-all hover:bg-rose-400/10 hover:text-rose-400"
        >
          <LogOut className="mr-3 h-4 w-4" />
          <span className="text-sm font-medium">Đăng xuất</span>
        </Button>
      </div>
    </div>
  );
}
