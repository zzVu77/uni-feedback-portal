"use client";
import { Button } from "@/components/ui/button";
import { ASSETS } from "@/constants/assets";

import { cn } from "@/lib/utils";
import {
  Bell,
  History,
  LogOut,
  MessageCircle,
  MessageSquareText,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const menuItems = [
  { href: "#3", label: "Thông báo", icon: Bell },
  { href: "/create-new-feedback", label: "Gửi góp ý", icon: MessageSquareText },
  { href: "#1", label: "Lịch sử góp ý của tôi", icon: History },
  { href: "#2", label: "Diễn đàn sinh viên", icon: MessageCircle },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div>
      {/* Sidebar Desktop */}
      <div className="bg-neutral-dark-primary-800 hidden h-screen w-60 flex-col border-r text-white shadow-md lg:flex">
        <div className="flex items-center justify-center border-b-1 border-white/50 py-2">
          <Image
            src={ASSETS.LOGO_UTE}
            alt="Logo UTE"
            height={100}
            width={100}
          />
        </div>
        <div className="flex flex-row items-center justify-center gap-2 border-b-1 border-white/50 py-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback className="text-black">CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center">
            <span className="text-[16px] font-medium text-white">
              Nguyễn Văn Vũ
            </span>
            <span className="text-muted/80 text-[14px] font-normal">
              (Sinh viên)
            </span>
          </div>
        </div>

        <div className="flex h-full flex-col justify-between">
          <div className="flex flex-col gap-2">
            {menuItems.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "hover:text-neutral-dark-primary-800 w-full justify-start rounded-none text-white hover:bg-white",
                    pathname === href
                      ? "text-neutral-dark-primary-800 bg-white font-semibold"
                      : "",
                  )}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {label}
                </Button>
              </Link>
            ))}
          </div>
          <div className="border-t border-white p-2">
            <Button className="text-neutral-dark-primary-800 flex w-full items-center justify-center bg-white hover:bg-gray-100">
              <LogOut className="text-neutral-dark-primary-800 mr-2 h-4 w-4" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Mobile */}
      {/* <div className="fixed bottom-0 left-0 z-50 flex h-16 w-full items-center justify-around border-t border-gray-200 bg-white shadow-md lg:hidden">
        {menuItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center text-lg font-medium transition-colors",
                active
                  ? "text-neutral-dark-primary-800"
                  : "hover:text-neutral-dark-primary-800 text-gray-500",
              )}
            >
              <Icon
                className={cn(
                  "mb-1 h-5 w-5",
                  active ? "text-neutral-dark-primary-800" : "",
                )}
              />
              {label}
            </Link>
          );
        })}

        <button className="flex flex-col items-center justify-center text-xs text-gray-500 hover:text-green-500">
          <LogOut className="mb-1 h-5 w-5" />
          Đăng xuất
        </button>
      </div> */}
    </div>
  );
}
