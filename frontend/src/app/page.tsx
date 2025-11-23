"use client";
import { useUser } from "@/context/UserContext";
import { getUrlByRole } from "@/utils/getUrlByRole";
import { redirect } from "next/navigation";

const Page = () => {
  const { user } = useUser();
  const pathName = getUrlByRole(user?.role || "/login");
  redirect(pathName);
};

export default Page;
