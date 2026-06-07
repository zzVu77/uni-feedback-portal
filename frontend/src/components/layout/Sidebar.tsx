"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

import { ASSETS } from "@/constants/assets";
import {
  adminNavigation,
  NavigationItem,
  staffAssistantNavigation,
  staffNavigation,
  studentNavigation,
} from "@/constants/navigation";

import { useLogout } from "@/hooks/queries/useAuthenticationQueries";
import { useGetUnreadNotificationCount } from "@/hooks/queries/useNotificationQueries";

import { useUser } from "@/context/UserContext";

import { cn } from "@/lib/utils";
import { getRoleDisplayName } from "@/utils/getRoleDisplayName";

import { LogOut } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarProps = {
  showOnMobile?: boolean;
  type?: "student" | "staff" | "admin" | "staff-assistant";
  fullName?: string;
};

export default function Sidebar({
  showOnMobile = false,
  type = "student",
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

    case "staff-assistant":
      navigation = staffAssistantNavigation;
      break;

    default:
      navigation = studentNavigation;
  }

  const { mutateAsync: logout, isPending } = useLogout();

  const { setUser, user } = useUser();

  return (
    <div
      className={cn(
        "flex h-screen w-[280px] flex-col overflow-hidden border-r border-slate-200/60 bg-white/80 shadow-xl backdrop-blur-xl",
        showOnMobile ? "w-full border-r-0" : "hidden lg:flex",
      )}
    >
      {/* Logo */}
      <div className="flex flex-shrink-0 items-center justify-center border-b border-slate-100/60 px-4 py-2">
        <Image
          src={ASSETS.LOGO_UTE}
          alt="Logo UTE"
          width={110}
          height={110}
          className="drop-shadow-sm"
        />
      </div>

      {/* User Info */}
      <div className="px-2 py-2">
        <Link
          href="/profile"
          className="group flex flex-shrink-0 items-center gap-3 rounded-[20px] border border-slate-100/60 bg-slate-50/50 p-3 transition-all duration-300 hover:bg-white hover:shadow-sm"
        >
          <Avatar className="h-12 w-12 border-2 border-white shadow-sm transition-transform duration-300 group-hover:scale-105">
            <AvatarImage
              src={user?.avatarUrl || "https://github.com/shadcn.png"}
              className="object-cover"
            />
            <AvatarFallback className="bg-indigo-100 text-lg font-bold text-indigo-700">
              {user?.fullName
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase() || "CN"}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <span className="max-w-[140px] truncate text-[12px] font-bold text-slate-800 transition-colors group-hover:text-indigo-700">
              {user?.fullName}
            </span>
            <span className="text-[12px] font-semibold text-slate-400">
              {getRoleDisplayName(type)}
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="min-h-0 flex-1">
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-1.5 px-4 pb-4">
            {navigation.map(({ href, label, icon: Icon }) => {
              const isNotificationItem = href === "/notifications";
              const isActive = pathname.includes(href);

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
                      "h-auto w-full justify-start rounded-[16px] px-4 py-3.5 text-[14px] font-medium transition-all duration-300",
                      isActive
                        ? "bg-indigo-600 font-semibold text-white shadow-[0_4px_16px_rgba(79,70,229,0.3)] hover:bg-indigo-700 hover:text-white"
                        : "text-slate-500 hover:bg-indigo-50/80 hover:text-indigo-700",
                    )}
                  >
                    <Icon
                      className={cn(
                        "mr-3 h-[18px] w-[18px] shrink-0",
                        isActive ? "text-white" : "text-slate-400",
                      )}
                    />

                    <span className="truncate">{label}</span>

                    {showBadge && (
                      <span
                        className={cn(
                          "ml-auto flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm",
                          isActive ? "bg-white text-indigo-700" : "bg-rose-500",
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

      {/* Logout */}
      <div className="flex-shrink-0 border-t border-slate-100/60 p-1">
        <Button
          variant="ghost"
          disabled={isPending}
          onClick={async () => {
            await logout().then(() => {
              setUser(null);
            });
          }}
          className="group h-auto w-full justify-start rounded-[16px] px-4 py-3.5 text-slate-500 transition-all duration-300 hover:bg-rose-50 hover:text-rose-600"
        >
          <LogOut className="mr-3 h-[18px] w-[18px] transition-transform group-hover:-translate-x-1" />
          <span className="text-[14px] font-bold">Đăng xuất</span>
        </Button>
      </div>
    </div>
  );
}
