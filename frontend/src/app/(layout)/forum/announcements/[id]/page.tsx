"use client";
import EmptyState from "@/components/common/EmptyState";
import { Loading } from "@/components/common/Loading";
import AnnouncementDetail from "@/components/forum/AnnouncementDetail";
import CommentSection from "@/components/forum/CommentSection";
import Wrapper from "@/components/shared/Wrapper";
import { useGetAnnouncementByIdForAuthenticatedUsers } from "@/hooks/queries/useAnnouncementQueries";
import { useGetCommentsByAnnouncementId } from "@/hooks/queries/useCommentQueries";
import { useIsClient } from "@/hooks/useIsClient";
import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams();
  const id = params.id as string;
  const isClient = useIsClient();
  const {
    data: announcement,
    isLoading: isAnnouncementLoading,
    error,
    isError,
    refetch,
  } = useGetAnnouncementByIdForAuthenticatedUsers(id, {
    enabled: isClient,
  });
  // Fetch comments
  const { data: comments, isLoading: isCommentsLoading } =
    useGetCommentsByAnnouncementId(id, {
      enabled: isClient,
    });

  if (isAnnouncementLoading) return <Loading variant="spinner" />;

  if (
    error &&
    (error as { response?: { status: number } }).response?.status === 404
  ) {
    return (
      <div className="flex h-full w-full grow flex-col items-center justify-center">
        <EmptyState
          title="Không tìm thấy thông báo"
          description={`Chúng tôi không tìm thấy thông báo với ID: ${id}. Vui lòng kiểm tra lại hoặc quay lại trang chủ diễn đàn.`}
          backLink="/forum"
          backLabel="Quay lại diễn đàn"
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
          description="Đã có lỗi xảy ra trong quá trình tải thông tin thông báo. Vui lòng thử lại."
          retryAction={() => refetch()}
          errorCode="FETCH_ERROR"
        />
      </div>
    );
  }

  if (!announcement)
    return (
      <div className="flex h-full w-full grow flex-col items-center justify-center">
        <EmptyState
          title="Không tìm thấy thông báo"
          description={`Chúng tôi không tìm thấy thông báo với ID: ${id}. Vui lòng kiểm tra lại hoặc quay lại trang chủ diễn đàn.`}
          backLink="/forum"
          backLabel="Quay lại diễn đàn"
          errorCode={404}
        />
      </div>
    );

  if (isCommentsLoading || !comments) return <Loading variant="spinner" />;
  return (
    <div className="w-full">
      <Wrapper>
        <AnnouncementDetail data={announcement} />
        {isCommentsLoading || !comments ? (
          <Loading variant="spinner" />
        ) : (
          <CommentSection
            type="announcement"
            postId={id}
            data={comments?.results ?? []}
          />
        )}
      </Wrapper>
    </div>
  );
};

export default Page;
