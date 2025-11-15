"use client";
import FeedbackForm from "@/components/feedback/FeedbackForm";
import Wrapper from "@/components/shared/Wrapper";
import { useCreateFeedback } from "@/hooks/queries/useFeedbackQueries";
import { FeedbackParams } from "@/types";
const page = () => {
  const createFeedback = useCreateFeedback();

  const handleSubmit = async (values: FeedbackParams) => {
    await createFeedback.mutateAsync(values);
  };

  return (
    <Wrapper>
      <div className="h-full w-full">
        <FeedbackForm type="create" onSubmit={handleSubmit} />
      </div>
    </Wrapper>
  );
};

export default page;
