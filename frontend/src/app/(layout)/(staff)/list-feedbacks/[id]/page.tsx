"use client";
import { Loading } from "@/components/common/Loading";
import ConversationSection from "@/components/conversation/ConversationSection";
import FeedbackDetailHeader from "@/components/feedback/FeedbackDetailHeader";
import StaffAction from "@/components/feedback/staff-feedbacks-list/StaffAction";
import StatusTimeLine from "@/components/feedback/StatusTimeline";
import Wrapper from "@/components/shared/Wrapper";
import { useGetStaffFeedbackById } from "@/hooks/queries/useFeedbackQueries";
import { useIsClient } from "@/hooks/useIsClient";
import { mapFeedbackDetailToHeader } from "@/utils/mappers";
import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams();
  const id = params.id as string;
  const isClient = useIsClient();
  const { data: feedback, isLoading } = useGetStaffFeedbackById(id, {
    enabled: isClient,
  });
  if (isLoading || !feedback) return <Loading variant="spinner" />;
  const feedbackHeaderData = mapFeedbackDetailToHeader(feedback);
  return (
    <Wrapper classNames={{ container: "lg:px-4" }}>
      <div className="grid grid-cols-1 gap-x-5 gap-y-8 pb-3 lg:grid-cols-2">
        <div className="col-span-1 flex w-full flex-col items-start justify-between gap-2 lg:col-span-2 lg:flex-row">
          <FeedbackDetailHeader type="staff" data={feedbackHeaderData} />
          <StaffAction />
        </div>
        <StatusTimeLine />
        <ConversationSection />
      </div>
    </Wrapper>
  );
};

export default Page;
