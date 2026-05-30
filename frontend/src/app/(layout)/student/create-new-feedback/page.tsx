"use client";
import FeedbackForm from "@/components/feedback/FeedbackForm";
import Wrapper from "@/components/shared/Wrapper";
import { useCreateFeedback } from "@/hooks/queries/useFeedbackQueries";
import { CreateFeedbackPayload } from "@/types";
const page = () => {
  const { mutateAsync: createFeedback, isPending } = useCreateFeedback();
  const handleSubmit = async (values: CreateFeedbackPayload) => {
    await createFeedback(values);
  };

  return (
    <Wrapper>
      <FeedbackForm
        type="create"
        onSubmit={handleSubmit}
        isPending={isPending}
      />
    </Wrapper>
  );
};

export default page;
