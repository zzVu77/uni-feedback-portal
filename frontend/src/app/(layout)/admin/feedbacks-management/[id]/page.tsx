"use client";
import { Loading } from "@/components/common/Loading";
import FeedbackDetailHeader from "@/components/feedback/FeedbackDetailHeader";
import StatusTimeLine from "@/components/feedback/StatusTimeline";
import Wrapper from "@/components/shared/Wrapper";
import { useGetAdminFeedbackById } from "@/hooks/queries/useFeedbackQueries";
import { useIsClient } from "@/hooks/useIsClient";
import { mapFeedbackDetailToHeader } from "@/utils/mappers";
import { useParams } from "next/navigation";

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
      <div className="grid w-full grid-cols-1 gap-x-5 gap-y-4 pb-3">
        <FeedbackDetailHeader type="staff" data={feedbackHeaderData} />
        <StatusTimeLine statusHistory={feedback.statusHistory} />
      </div>
    </Wrapper>
  );
};

export default Page;
