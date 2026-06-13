"use client";

import { useState } from "react";
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

import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarProps = {
  showOnMobile?: boolean;
  type?: "student" | "staff" | "admin" | "staff_assistant";
  fullName?: string;
};

export default function Sidebar({
  showOnMobile = false,
  type = "student",
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
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

    case "staff_assistant":
      navigation = staffAssistantNavigation;
      break;

    default:
      navigation = studentNavigation;
  }

  const { mutateAsync: logout, isPending } = useLogout();

  const { setUser, user } = useUser();

  const isCollapsedDesktop = isCollapsed && !showOnMobile;

  return (
    <div
      className={cn(
        "relative flex h-screen flex-col overflow-visible border-r border-slate-200/60 bg-white/80 shadow-xl backdrop-blur-xl transition-all duration-300",
        showOnMobile
          ? "w-full border-r-0"
          : isCollapsed
            ? "hidden w-[80px] lg:flex"
            : "hidden w-[280px] lg:flex",
      )}
    >
      {!showOnMobile && (
        <Button
          variant="default"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute top-4 -right-2 z-50 flex h-7 w-7 items-center justify-center rounded-full bg-white text-black shadow-[0_4px_12px_rgba(79,70,229,0.4)] transition-all hover:scale-110 hover:bg-white"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      )}

      {/* Logo */}
      <div className="flex min-h-[70px] flex-shrink-0 items-center justify-center border-b border-slate-100/60 px-4 py-2">
        <Image
          src={ASSETS.LOGO_UTE}
          alt="Logo UTE"
          width={isCollapsedDesktop ? 40 : 110}
          height={isCollapsedDesktop ? 40 : 110}
          className={cn(
            "drop-shadow-sm transition-all duration-300",
            isCollapsedDesktop && "scale-90",
          )}
        />
      </div>

      {/* User Info */}
      <div className="px-2 py-2">
        <Link
          href="/profile"
          className={cn(
            "group flex flex-shrink-0 items-center rounded-[20px] border border-slate-100/60 bg-slate-50/50 transition-all duration-300 hover:bg-white hover:shadow-sm",
            isCollapsedDesktop ? "justify-center p-2" : "gap-3 p-3",
          )}
        >
          <Avatar className="h-12 w-12 shrink-0 border-2 border-white shadow-sm transition-transform duration-300 group-hover:scale-105">
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

          {!isCollapsedDesktop && (
            <div className="flex flex-col overflow-hidden">
              <span className="max-w-[140px] truncate text-[12px] font-bold text-slate-800 transition-colors group-hover:text-indigo-700">
                {user?.fullName}
              </span>
              <span className="text-[12px] font-semibold text-slate-400">
                {getRoleDisplayName(type)}
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <div className="min-h-0 flex-1">
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-1.5 px-3 pb-4">
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
                <Link
                  key={href}
                  href={href}
                  title={isCollapsedDesktop ? label : undefined}
                >
                  <Button
                    variant="ghost"
                    className={cn(
                      "relative h-auto w-full rounded-[16px] py-3.5 text-[14px] font-medium transition-all duration-300",
                      isCollapsedDesktop
                        ? "justify-center px-0"
                        : "justify-start px-4",
                      isActive
                        ? "bg-indigo-600 font-semibold text-white shadow-[0_4px_16px_rgba(79,70,229,0.3)] hover:bg-indigo-700 hover:text-white"
                        : "text-slate-500 hover:bg-indigo-50/80 hover:text-indigo-700",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-[18px] w-[18px] shrink-0",
                        isActive ? "text-white" : "text-slate-400",
                        !isCollapsedDesktop && "mr-3",
                      )}
                    />

                    {!isCollapsedDesktop && (
                      <span className="truncate">{label}</span>
                    )}

                    {showBadge && (
                      <span
                        className={cn(
                          "flex items-center justify-center rounded-full font-bold text-white shadow-sm",
                          isActive ? "bg-white text-indigo-700" : "bg-rose-500",
                          isCollapsedDesktop
                            ? "absolute top-2 right-2 h-2.5 w-2.5 px-0 py-0 text-[0px]"
                            : "ml-auto min-w-5 px-1.5 py-0.5 text-[10px]",
                        )}
                      >
                        {!isCollapsedDesktop && displayCount}
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
      <div className="flex-shrink-0 border-t border-slate-100/60 p-2">
        <Button
          variant="ghost"
          disabled={isPending}
          onClick={async () => {
            await logout().then(() => {
              setUser(null);
            });
          }}
          title={isCollapsedDesktop ? "Đăng xuất" : undefined}
          className={cn(
            "group h-auto w-full rounded-[16px] py-3.5 text-slate-500 transition-all duration-300 hover:bg-rose-50 hover:text-rose-600",
            isCollapsedDesktop ? "justify-center px-0" : "justify-start px-4",
          )}
        >
          <LogOut
            className={cn(
              "h-[18px] w-[18px] transition-transform group-hover:-translate-x-1",
              !isCollapsedDesktop && "mr-3",
            )}
          />
          {!isCollapsedDesktop && (
            <span className="text-[14px] font-bold">Đăng xuất</span>
          )}
        </Button>
      </div>
    </div>
  );
}
