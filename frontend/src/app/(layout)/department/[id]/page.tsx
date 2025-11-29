"use client";
import { DepartmentAnnouncementList } from "@/components/department/DepartmentAnnouncementList";
import { DepartmentHeader } from "@/components/department/DepartmentHeader";
import { DepartmentSkeleton } from "@/components/department/DepartmentSkeleton";
import { Button } from "@/components/ui/button";
import { useGetDepartmentDetail } from "@/hooks/queries/useDepartmentQueries";
import { Building2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
const DepartmentDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const departmentId = params?.id as string;
  const {
    data: department,
    isLoading,
    isError,
  } = useGetDepartmentDetail(departmentId);

  if (isLoading) return <DepartmentSkeleton />;

  if (isError || !department) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4 text-center">
        <div className="rounded-full bg-red-50 p-4">
          <Building2 className="h-12 w-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">
          Không tìm thấy phòng ban
        </h2>
        <Button variant="outline" onClick={() => router.back()}>
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-50/50">
      <div className="px-4">
        <div className="flex w-full flex-col gap-4">
          <DepartmentHeader department={department} />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="border-l-4 border-red-600 pl-3 text-xl font-bold text-gray-900">
                Thông báo từ Khoa/Phòng
              </h2>
            </div>
            <DepartmentAnnouncementList departmentId={department.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetailPage;
