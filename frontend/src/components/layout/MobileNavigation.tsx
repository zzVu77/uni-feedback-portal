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
  type?: "student" | "staff" | "admin";
  fullName?: string;
};
const MobileNavigation = ({ type = "student", fullName }: Props) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="bg-neutral-dark-primary-800 fixed top-0 left-0 z-50 flex h-16 w-full items-center justify-between px-4 shadow-md lg:hidden">
      <Drawer open={open} onOpenChange={setOpen} direction="left">
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className="border-0 bg-transparent px-1 shadow-none hover:bg-transparent"
          >
            <Menu className="text-white" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="w-3">
          <DrawerTitle></DrawerTitle>
          <Sidebar showOnMobile={true} type={type} />
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
        <DropdownMenuContent className="mr-3">
          <DropdownMenuLabel>
            <div className="flex flex-col items-center gap-[2px]">
              <span className="text-[14px] font-medium">{fullName}</span>
              <span className="text-[12px] font-normal">
                ({getRoleDisplayName(type)})
              </span>
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
