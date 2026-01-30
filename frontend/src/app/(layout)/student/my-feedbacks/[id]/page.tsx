/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";
import { Loading } from "@/components/common/Loading";
import EmptyState from "@/components/common/EmptyState";
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
    isError,
    refetch,
  } = useGetMyFeedbackById(id, {
    enabled: isClient,
  });

  if (isLoading) return <Loading variant="spinner" />;

  if (isError) {
    return (
      <div className="flex h-full w-full grow flex-col items-center justify-center">
        <EmptyState
          title="Lỗi tải dữ liệu"
          description="Đã có lỗi xảy ra trong quá trình tải thông tin phản hồi. Vui lòng thử lại."
          retryAction={() => refetch()}
          errorCode="FETCH_ERROR"
        />
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="flex h-full w-full grow flex-col items-center justify-center">
        <EmptyState
          title="Không tìm thấy phản hồi"
          description={`Chúng tôi không tìm thấy phản hồi với mã ID: ${id}. Vui lòng kiểm tra lại đường dẫn.`}
          backLink="/student/my-feedbacks"
          backLabel="Quay lại danh sách"
          errorCode={404}
        />
      </div>
    );
  }

  const feedbackHeaderData = mapFeedbackDetailToHeader(feedback);
  return (
    <Wrapper classNames={{ container: "lg:px-4" }}>
      <div className="grid w-full grid-cols-1 gap-x-2 gap-y-2 pb-3 lg:grid-cols-2">
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
