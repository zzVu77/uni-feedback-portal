"use client";
import { getRoleDisplayName } from "@/utils/getRoleDisplayName";
import { CircleUserRound, KeyRound, Menu } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Sidebar from "./Sidebar";
type Props = {
  type?: "student" | "staff" | "admin" | "staff-assistant";
  fullName?: string;
};
const MobileNavigation = ({ type = "student", fullName }: Props) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="fixed top-0 left-0 z-50 flex h-16 w-full items-center justify-between border-b border-slate-200/60 bg-white/80 px-4 shadow-sm backdrop-blur-xl lg:hidden">
      <Drawer open={open} onOpenChange={setOpen} direction="left">
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className="border-0 bg-transparent px-1 shadow-none transition-colors hover:bg-slate-100/50"
          >
            <Menu className="text-slate-800" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="w-3">
          <DrawerTitle className="hidden">Menu</DrawerTitle>
          <Sidebar showOnMobile={true} type={type} />
        </DrawerContent>
      </Drawer>
      {/* Profile and Change password */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="h-10 w-10 cursor-pointer border-2 border-white shadow-sm transition-transform hover:scale-105">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback className="bg-indigo-100 font-bold text-indigo-700">
              {fullName
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase() || "CN"}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mr-3 w-56 rounded-[16px] border border-white/60 bg-white/90 p-2 shadow-lg backdrop-blur-xl">
          <DropdownMenuLabel className="px-2 py-3">
            <div className="flex flex-col items-start gap-1">
              <span className="text-[14px] font-bold text-slate-800">
                {fullName}
              </span>
              <span className="text-[12px] font-semibold text-slate-400">
                ({getRoleDisplayName(type)})
              </span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-slate-100/60" />
          <DropdownMenuItem
            asChild
            className="cursor-pointer rounded-[10px] px-3 py-2.5 transition-colors focus:bg-indigo-50 focus:text-indigo-700"
          >
            <Link href="/profile" className="flex items-center">
              <CircleUserRound className="mr-3 h-4 w-4" />
              <span className="font-medium">Hồ sơ của tôi</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex cursor-pointer items-center rounded-[10px] px-3 py-2.5 transition-colors focus:bg-indigo-50 focus:text-indigo-700"
            // onClick={handleLogout}
          >
            <KeyRound className="mr-3 h-4 w-4" />
            <span className="font-medium">Đổi mật khẩu</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default MobileNavigation;
