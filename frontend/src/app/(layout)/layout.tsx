"use client";
import { Loading } from "@/components/common/Loading";
import MobileNavigation from "@/components/layout/MobileNavigation";
import Sidebar from "@/components/layout/Sidebar";
import { useUser } from "@/context/UserContext";
import { getSidebarType } from "@/utils/getSidebarType";
import { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;
  if (!user) {
    return <Loading variant="fullscreen" />;
  }
  const type = getSidebarType(user.role);
  return (
    <div className="flex h-screen">
      <MobileNavigation type={type} fullName={user.fullName} />
      <Sidebar type={type} fullName={user.fullName} />
      <main className="h-full flex-1 overflow-y-auto bg-gray-100 px-1 py-2 pt-18 lg:py-3">
        {children}
      </main>
    </div>
  );
}
