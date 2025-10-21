"use client";
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

const MobileNavigation = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="fixed top-0 left-0 z-50 flex h-16 w-full items-center justify-between border-t border-gray-200 bg-white px-4 shadow-md lg:hidden">
      <Drawer open={open} onOpenChange={setOpen} direction="left">
        <DrawerTrigger asChild>
          <Button variant="outline" className="border-0 px-1 shadow-none">
            <Menu />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="w-3">
          <DrawerTitle></DrawerTitle>
          <Sidebar showOnMobile={true} />
        </DrawerContent>
      </Drawer>
      {/* Profile and Change password */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback className="text-black">CN</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>
            <div className="flex flex-col items-center gap-[2px]">
              <span className="text-[14px] font-medium">Nguyễn Văn Vũ</span>
              <span className="text-[12px] font-normal">(Sinh viên)</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="#" className="flex cursor-pointer items-center">
              <CircleUserRound className="mr-2 h-4 w-4" />
              Hồ sơ của tôi
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex cursor-pointer items-center"
            // onClick={handleLogout}
          >
            <KeyRound className="mr-2 h-4 w-4" />
            Đổi mật khẩu
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default MobileNavigation;
