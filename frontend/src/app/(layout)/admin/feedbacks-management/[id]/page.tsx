"use client";
import { Loading } from "@/components/common/Loading";
import FeedbackDetailHeader from "@/components/feedback/FeedbackDetailHeader";
import StatusTimeLine from "@/components/feedback/StatusTimeline";
import Wrapper from "@/components/shared/Wrapper";
import { useGetAdminFeedbackById } from "@/hooks/queries/useFeedbackQueries";
import { useIsClient } from "@/hooks/useIsClient";
import { mapFeedbackDetailToHeader } from "@/utils/mappers";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { History, Star } from "lucide-react";
import { FeedbackRatingView } from "@/components/feedback/FeedbackRatingView";

const Page = () => {
  const params = useParams();
  const id = params.id as string;
  const isClient = useIsClient();
  const { data: feedback, isLoading } = useGetAdminFeedbackById(id, {
    enabled: isClient,
  });
  if (isLoading || !feedback) return <Loading variant="spinner" />;
  const feedbackHeaderData = mapFeedbackDetailToHeader(feedback);
  return (
    <Wrapper classNames={{ container: "lg:px-4" }}>
      <div className="grid h-full w-full grid-cols-1 gap-x-5 gap-y-2 pb-3">
        <FeedbackDetailHeader type="staff" data={feedbackHeaderData} />
        <div>
          <Tabs defaultValue="timeline" className="w-full">
            <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 rounded-2xl border border-gray-200/90 bg-white p-1.5 shadow-lg md:h-12 md:flex-nowrap md:justify-center md:rounded-full">
              <TabsTrigger
                value="timeline"
                className="flex-1 cursor-pointer rounded-full px-3 py-1.5 text-[12px] whitespace-nowrap transition-all data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-sm md:text-[14px]"
              >
                <History className="mr-1 h-4 w-4" />
                Lịch sử
              </TabsTrigger>
              <TabsTrigger
                value="rating"
                className="flex-1 cursor-pointer rounded-full px-3 py-1.5 text-[12px] whitespace-nowrap transition-all data-[state=active]:bg-amber-500 data-[state=active]:text-white data-[state=active]:shadow-sm md:text-[14px]"
              >
                <Star className="mr-1 h-4 w-4" />
                Đánh giá
              </TabsTrigger>
            </TabsList>
            <div className="mt-4">
              <TabsContent
                value="timeline"
                className="m-0 focus-visible:outline-none"
              >
                <StatusTimeLine statusHistory={feedback.statusHistory} />
              </TabsContent>
              <TabsContent
                value="rating"
                className="m-0 focus-visible:outline-none"
              >
                <FeedbackRatingView feedback={feedback} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </Wrapper>
  );
};

export default Page;
