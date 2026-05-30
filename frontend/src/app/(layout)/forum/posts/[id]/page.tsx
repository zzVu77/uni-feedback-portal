"use client";
import EmptyState from "@/components/common/EmptyState";
import { Loading } from "@/components/common/Loading";
import CommentSection from "@/components/forum/CommentSection";
import FeedbackPostDetail from "@/components/forum/FeedbackPostDetail";
import OfficialResponse from "@/components/forum/OfficialResponse";
import Wrapper from "@/components/shared/Wrapper";
import { useGetCommentsByPostId } from "@/hooks/queries/useCommentQueries";
import { useGetForumPostById } from "@/hooks/queries/useForumPostQueries";
import { useIsClient } from "@/hooks/useIsClient";
import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams();
  const id = params.id as string;

  const isClient = useIsClient();
  const {
    data: forumDetail,
    isLoading: isFeedbackLoading,
    error,
    isError,
    refetch,
  } = useGetForumPostById(id, {
    enabled: isClient,
  });

  // Fetch comments
  const { data: comments, isLoading: isCommentsLoading } =
    useGetCommentsByPostId(id, {
      enabled: isClient,
    });

  if (isFeedbackLoading) return <Loading variant="spinner" />;

  if (
    error &&
    (error as { response?: { status: number } }).response?.status === 404
  ) {
    return (
      <div className="flex h-full w-full grow flex-col items-center justify-center">
        <EmptyState
          title="Không tìm thấy bài viết"
          description={`Chúng tôi không tìm thấy bài viết với ID: ${id}. Vui lòng kiểm tra lại hoặc quay lại trang chủ diễn đàn.`}
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
          description="Dữ liệu không tồn tại hoặc đường dẫn không hợp lệ."
          retryAction={() => refetch()}
          errorCode="FETCH_ERROR"
        />
      </div>
    );
  }

  if (!forumDetail)
    return (
      <div className="flex h-full w-full grow flex-col items-center justify-center">
        <EmptyState
          title="Không tìm thấy bài viết"
          description={`Chúng tôi không tìm thấy bài viết với ID: ${id}. Vui lòng kiểm tra lại hoặc quay lại trang chủ diễn đàn.`}
          backLink="/forum"
          backLabel="Quay lại diễn đàn"
          errorCode={404}
        />
      </div>
    );

  return (
    <div className="w-full">
      <Wrapper>
        <FeedbackPostDetail data={forumDetail} />
        {forumDetail.feedback.officialResponse !== null && (
          <OfficialResponse
            departmentName={forumDetail.feedback.department.name}
            responseContent={forumDetail.feedback.officialResponse.content}
            responseDate={forumDetail.feedback.officialResponse.createdAt}
          />
        )}

        {isCommentsLoading || !comments ? (
          <Loading variant="spinner" />
        ) : (
          <CommentSection
            type="feedback"
            postId={id}
            data={comments?.results ?? []}
          />
        )}
      </Wrapper>
    </div>
  );
};

export default Page;
