"use client";
import { Button } from "@/components/ui/button";
import { ASSETS } from "@/constants/assets";

import { adminNavigation } from "@/constants/navigation";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type SidebarProps = {
  showOnMobile?: boolean;
};
export default function Sidebar({ showOnMobile = false }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div>
      {/* Sidebar Desktop */}
      <div
        className={cn(
          "bg-neutral-dark-primary-800 border-neutral-dark-primary-800/20 h-screen w-60 flex-col gap-4 border-r-1 text-white",
          showOnMobile ? "flex w-full" : "hidden lg:flex",
        )}
      >
        <div className="flex items-center justify-center border-b-1 border-white/20 py-3">
          <Image
            src={ASSETS.LOGO_UTE}
            alt="Logo UTE"
            height={100}
            width={100}
          />
        </div>
        <div className="flex flex-row items-center justify-center gap-2">
          <Avatar className="h-12 w-12">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback className="text-black">CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center">
            <span className="text-[14px] font-medium text-white lg:text-[16px]">
              Nguyễn Văn Vũ
            </span>
            <span className="text-muted/80 text-[12px] font-normal lg:text-[14px]">
              (Sinh viên)
            </span>
          </div>
        </div>

        <div className="flex h-full flex-col justify-between border-t-1 border-white/20">
          <div className="flex flex-col gap-2">
            {adminNavigation.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "hover:text-neutral-dark-primary-800 w-full justify-start rounded-none text-[13px] text-white hover:bg-white lg:text-[14px]",
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
          <div className="border-t border-white/20 p-2">
            <Button className="text-neutral-dark-primary-800 flex w-full items-center justify-center bg-white hover:bg-gray-100">
              <LogOut className="text-neutral-dark-primary-800 mr-2 h-4 w-4" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
