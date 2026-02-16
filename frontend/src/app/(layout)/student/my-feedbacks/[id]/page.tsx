"use client";
import EmptyState from "@/components/common/EmptyState";
import { Loading } from "@/components/common/Loading";
import ConversationSection from "@/components/conversation/ConversationSection";
import FeedbackDetailHeader from "@/components/feedback/FeedbackDetailHeader";
import StatusTimeLine from "@/components/feedback/StatusTimeline";
import Wrapper from "@/components/shared/Wrapper";
import { useGetMyFeedbackById } from "@/hooks/queries/useFeedbackQueries";
import { useIsClient } from "@/hooks/useIsClient";
import { mapFeedbackDetailToHeader } from "@/utils/mappers";
import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams();
  const id = params.id as string;

  const isClient = useIsClient();
  const {
    data: feedback,
    isLoading,
    error,
    isError,
    refetch,
  } = useGetMyFeedbackById(id, {
    enabled: isClient,
  });

  if (isLoading) return <Loading variant="spinner" />;

  if (
    error &&
    (error as { response?: { status: number } }).response?.status === 404
  ) {
    return (
      <div className="flex h-full w-full grow flex-col items-center justify-center">
        <EmptyState
          title="Không tìm thấy góp ý"
          description={`Chúng tôi không tìm thấy góp ý với ID: ${id}. Vui lòng kiểm tra lại hoặc quay lại danh sách góp ý của bạn.`}
          backLink="/student/my-feedbacks"
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

  if (!feedback)
    return (
      <div className="flex h-full w-full grow flex-col items-center justify-center">
        <EmptyState
          title="Không tìm thấy phản hồi"
          description={`Chúng tôi không tìm thấy phản hồi với ID: ${id}. Vui lòng kiểm tra lại hoặc quay lại danh sách phản hồi của bạn.`}
          backLink="/student/my-feedbacks"
          backLabel="Quay lại danh sách"
          errorCode={404}
        />
      </div>
    );

  const feedbackHeaderData = mapFeedbackDetailToHeader(feedback);
  return (
    <Wrapper classNames={{ container: "lg:px-4" }}>
      <div className="grid h-full w-full grid-cols-1 gap-x-2 gap-y-2 pb-3 lg:grid-cols-2">
        <div className="col-span-1 w-full lg:col-span-2">
          <FeedbackDetailHeader type="student" data={feedbackHeaderData} />
        </div>
        <StatusTimeLine statusHistory={feedback.statusHistory} />
        <ConversationSection
          currentFeedbackStatus={feedback.currentStatus}
          role="student"
        />
      </div>
    </Wrapper>
  );
};

export default Page;
