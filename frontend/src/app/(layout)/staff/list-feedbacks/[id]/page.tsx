"use client";
import EmptyState from "@/components/common/EmptyState";
import { Loading } from "@/components/common/Loading";
import ConversationSection from "@/components/conversation/ConversationSection";
import FeedbackDetailHeader from "@/components/feedback/FeedbackDetailHeader";
import { RelatedFeedbackTable } from "@/components/feedback/RelatedFeedbackTable";
import StaffAction from "@/components/feedback/staff-feedbacks-list/StaffAction";
import StatusTimeLine from "@/components/feedback/StatusTimeline";
import Wrapper from "@/components/shared/Wrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetStaffFeedbackById } from "@/hooks/queries/useFeedbackQueries";
import { useIsClient } from "@/hooks/useIsClient";
import { mapFeedbackDetailToHeader } from "@/utils/mappers";
import { History, List, MessageCircleMore } from "lucide-react";
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
  } = useGetStaffFeedbackById(id, {
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
      <div className="flex h-full w-full flex-col gap-6 pb-3">
        {/* Top Section */}
        <div className="flex flex-col items-start justify-between gap-4 lg:flex-row">
          <div className="w-full min-w-0 flex-1">
            <FeedbackDetailHeader type="staff" data={feedbackHeaderData} />
          </div>
          {feedback.currentStatus !== "REJECTED" &&
            feedback.currentStatus !== "RESOLVED" &&
            feedback.isForwarding === false && (
              <div className="mt-2 w-full shrink-0 lg:mt-0 lg:w-auto">
                <StaffAction
                  feedbackId={id}
                  currentStatus={feedback.currentStatus}
                />
              </div>
            )}
        </div>

        {/* Bottom Section - Tabs */}
        <div>
          <Tabs defaultValue="timeline" className="w-full">
            <TabsList className="flex h-10 w-full rounded-full border-none bg-white p-1">
              <TabsTrigger
                value="timeline"
                className="md: cursor-pointer rounded-full px-1 text-[12px] transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm md:text-[14px]"
              >
                <History />
                Lịch sử
              </TabsTrigger>
              <TabsTrigger
                value="conversation"
                className="md: cursor-pointer rounded-full px-1 text-[12px] transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm md:text-[14px]"
              >
                <MessageCircleMore />
                Trao đổi
              </TabsTrigger>
              <TabsTrigger
                value="related"
                className="md: flex cursor-pointer items-center gap-2 rounded-full px-1 text-[12px] transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm md:text-[14px]"
              >
                <List />
                Góp ý tương tự
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="timeline"
              className="m-0 focus-visible:outline-none"
            >
              <StatusTimeLine statusHistory={feedback.statusHistory} />
            </TabsContent>
            <TabsContent
              value="conversation"
              className="m-0 focus-visible:outline-none"
            >
              <ConversationSection
                role="staff"
                isForwarded={feedback.isForwarding}
                currentFeedbackStatus={feedback.currentStatus}
              />
            </TabsContent>
            <TabsContent
              value="related"
              className="m-0 focus-visible:outline-none"
            >
              <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                <RelatedFeedbackTable />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Wrapper>
  );
};

export default Page;
