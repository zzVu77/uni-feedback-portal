"use client";
import { Loading } from "@/components/common/Loading";
import ConversationSection from "@/components/conversation/ConversationSection";
import FeedbackDetailHeader from "@/components/feedback/FeedbackDetailHeader";
import Wrapper from "@/components/shared/Wrapper";
import { useGetMyFeedbackById } from "@/hooks/queries/useFeedbackQueries";
import { useIsClient } from "@/hooks/useIsClient";
import { mapFeedbackDetailToHeader } from "@/utils/mappers";
import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams();
  const id = params.id as string;

  const isClient = useIsClient();
  const { data: feedback, isLoading } = useGetMyFeedbackById(id, {
    enabled: isClient,
  });
  if (isLoading || !feedback) return <Loading variant="spinner" />;
  const feedbackHeaderData = mapFeedbackDetailToHeader(feedback);
  return (
    <Wrapper>
      <div className="grid grid-cols-1 gap-x-4 gap-y-2 pb-3 lg:grid-cols-2">
        <div className="col-span-1 w-full lg:col-span-2">
          <FeedbackDetailHeader type="student" data={feedbackHeaderData} />
        </div>
        {/* <StatusTimeLine /> */}
        <ConversationSection
          currentFeedbackStatus={feedback.currentStatus}
          role="student"
        />
      </div>
    </Wrapper>
  );
};

export default Page;
