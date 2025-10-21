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
      <Sidebar />
      <main className="h-full flex-1 overflow-y-auto bg-gray-100 px-1 pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
