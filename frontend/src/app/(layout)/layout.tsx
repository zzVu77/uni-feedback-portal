import Sidebar from "@/components/layout/Sidebar";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-100 pb-20 md:pb-0">
        {children}
      </main>
    </div>
  );
}
