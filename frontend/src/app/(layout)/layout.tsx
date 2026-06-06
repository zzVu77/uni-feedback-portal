"use client";
import MobileNavigation from "@/components/layout/MobileNavigation";
import Sidebar from "@/components/layout/Sidebar";
import { useUser } from "@/context/UserContext";
import { getSidebarType } from "@/utils/getSidebarType";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();

  const type = getSidebarType(user?.role);
  return (
    <div className="flex h-screen overflow-hidden">
      <MobileNavigation type={type} />
      <Sidebar type={type} />
      <main className="h-full flex-1 overflow-y-auto bg-white px-2 py-3 md:py-0">
        {children}
      </main>
    </div>
  );
}
