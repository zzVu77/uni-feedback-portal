"use client";

import ConversationSection from "@/components/conversation/ConversationSection";
import FeedbackDetailHeader from "@/components/feedback/FeedbackDetailHeader";
import StatusTimeLine from "@/components/feedback/StatusTimeline";
import Wrapper from "@/components/shared/Wrapper";
import { useGetMyFeedbackById } from "@/hooks/queries/useFeedbackQueries";
import { mapFeedbackDetailToHeader } from "@/utils/mappers";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const params = useParams();
  const id = params.id as string;

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true);
    }
  }, []);
  const { data: feedback, isLoading } = useGetMyFeedbackById(id, {
    enabled: isClient,
  });
  if (isLoading || !feedback) return <div>Loading...</div>;
  const feedbackHeaderData = mapFeedbackDetailToHeader(feedback);
  return (
    <Wrapper>
      <div className="grid grid-cols-1 gap-x-5 gap-y-8 pb-3 lg:grid-cols-2">
        <div className="col-span-1 w-full lg:col-span-2">
          <FeedbackDetailHeader type="student" data={feedbackHeaderData} />
        </div>
        <StatusTimeLine />
        <ConversationSection />
      </div>
    </Wrapper>
  );
};

export default Page;
