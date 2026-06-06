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
import {
  useGetRelatedStaffFeedbacksById,
  useGetStaffFeedbackById,
} from "@/hooks/queries/useFeedbackQueries";
import { useIsClient } from "@/hooks/useIsClient";
import { mapFeedbackDetailToHeader } from "@/utils/mappers";
import { History, List, MessageCircleMore } from "lucide-react";
import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams();
  const id = params.id as string;
  const isClient = useIsClient();
  const {
    data: feedbackDetail,
    isLoading: isLoadingFeedbackDetail,
    isError: isErrorFeedbackDetail,
    refetch,
  } = useGetStaffFeedbackById(id, {
    enabled: isClient,
  });

  const {
    data: relatedFeedbacks,
    isLoading: relatedIsLoading,
    isError: relatedIsError,
  } = useGetRelatedStaffFeedbacksById(id);

  if (isLoadingFeedbackDetail || !isClient)
    return <Loading variant="spinner" />;

  if (isErrorFeedbackDetail) {
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

  if (!feedbackDetail)
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

  const feedbackHeaderData = mapFeedbackDetailToHeader(feedbackDetail);

  return (
    <Wrapper>
      <div className="flex h-full w-full flex-col gap-6 pb-3">
        {/* Top Section */}
        <div className="flex flex-col items-stretch justify-between gap-4 lg:flex-row">
          <div className="w-full min-w-0 flex-1">
            <FeedbackDetailHeader type="staff" data={feedbackHeaderData} />
          </div>
          {feedbackDetail.currentStatus !== "REJECTED" &&
            feedbackDetail.currentStatus !== "RESOLVED" &&
            feedbackDetail.isForwarding === false && (
              <div className="h-full w-full shrink-0 lg:mt-0 lg:w-auto">
                <StaffAction
                  feedbackId={id}
                  currentStatus={feedbackDetail.currentStatus}
                />
              </div>
            )}
        </div>

        {/* Bottom Section - Tabs */}
        <div>
          <Tabs defaultValue="timeline" className="w-full">
            <TabsList className="flex h-10 w-full rounded-full border-none bg-white p-1 shadow-lg">
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
                <div className="flex flex-row items-center justify-center gap-1.5">
                  <span>Góp ý tương tự</span>
                  <span className="ml-auto flex min-w-5 items-center justify-center rounded-full bg-red-600 px-0.5 py-0.5 text-[10px] font-bold text-white">
                    {relatedFeedbacks?.results?.length
                      ? relatedFeedbacks.results.length - 1
                      : 0}
                  </span>
                </div>
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="timeline"
              className="m-0 focus-visible:outline-none"
            >
              <StatusTimeLine statusHistory={feedbackDetail.statusHistory} />
            </TabsContent>
            <TabsContent
              value="conversation"
              className="m-0 focus-visible:outline-none"
            >
              <ConversationSection
                role="staff"
                isForwarded={feedbackDetail.isForwarding}
                currentFeedbackStatus={feedbackDetail.currentStatus}
              />
            </TabsContent>
            <TabsContent
              value="related"
              className="m-0 focus-visible:outline-none"
            >
              <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                <RelatedFeedbackTable
                  feedbacksList={relatedFeedbacks?.results || []}
                  isLoading={relatedIsLoading}
                  isError={relatedIsError}
                  originalFeedbackId={feedbackDetail.id}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Wrapper>
  );
};

export default Page;
