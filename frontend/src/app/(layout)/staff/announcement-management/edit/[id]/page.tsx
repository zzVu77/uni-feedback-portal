/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";
import EmptyState from "@/components/common/EmptyState";
import { Loading } from "@/components/common/Loading";
import AnnouncementForm from "@/components/forum/AnnouncementForm";
import Wrapper from "@/components/shared/Wrapper";
import {
  useGetAnnouncementByIdForStaff,
  useUpdateAnnouncementById,
} from "@/hooks/queries/useAnnouncementQueries"; // Adjust path if needed
import { useIsClient } from "@/hooks/useIsClient";
import { CreateAnnouncementPayload } from "@/types";
import { useParams } from "next/navigation";
import { useMemo } from "react"; // 1. Import useMemo

const Page = () => {
  const params = useParams();
  const id = params.id as string;
  const isClient = useIsClient();

  const {
    data: announcement,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAnnouncementByIdForStaff(id, {
    enabled: isClient,
  });

  const { mutateAsync: updateAnnouncement, isPending } =
    useUpdateAnnouncementById(id);

  // 2. Use useMemo to stabilize initialData
  const initialData = useMemo(() => {
    return announcement;
  }, [announcement]);

  if (isLoading) return <Loading variant="spinner" />;

  if (
    error &&
    (error as { response?: { status: number } }).response?.status === 404
  ) {
    return (
      <div className="flex h-full w-full grow flex-col items-center justify-center">
        <EmptyState
          title="Không tìm thấy thông báo"
          description={`Chúng tôi không tìm thấy thông báo với ID: ${id}. Vui lòng kiểm tra lại hoặc quay lại danh sách thông báo.`}
          backLink="/staff/announcement-management"
          backLabel="Quay lại danh sách"
          errorCode={404}
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full w-full grow flex-col items-center justify-center">
        <EmptyState
          title="Lỗi tải dữ liệu"
          description="Dữ liệu không tồn tại hoặc đường dẫn không hợp lệ."
          retryAction={() => refetch()}
          errorCode="FETCH_ERROR"
        />
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="flex h-full w-full grow flex-col items-center justify-center">
        <EmptyState
          title="Không tìm thấy thông báo"
          description={`Chúng tôi không tìm thấy thông báo với ID: ${id}. Vui lòng kiểm tra lại hoặc quay lại danh sách thông báo.`}
          backLink="/staff/announcement-management"
          backLabel="Quay lại danh sách"
          errorCode={404}
        />
      </div>
    );
  }

  const handleSubmit = async (values: CreateAnnouncementPayload) => {
    await updateAnnouncement(values);
  };

  return (
    <Wrapper>
      <div className="h-full w-full">
        <AnnouncementForm
          type="edit"
          initialData={initialData}
          onSubmit={handleSubmit}
          isPending={isPending}
        />
      </div>
    </Wrapper>
  );
};

export default Page;
