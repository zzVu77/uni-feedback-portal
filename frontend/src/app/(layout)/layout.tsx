import MobileNavigation from "@/components/layout/MobileNavigation";
import Sidebar from "@/components/layout/Sidebar";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <MobileNavigation />
      <Sidebar type="admin" />
      <main className="h-full flex-1 overflow-y-auto bg-gray-100 px-1 py-2 pt-18 lg:py-3">
        {children}
      </main>
    </div>
  );
}
