"use client";
import FeedbackForm from "@/components/feedback/FeedbackForm";
import Wrapper from "@/components/shared/Wrapper";
import { useCreateFeedback } from "@/hooks/queries/useFeedbackQueries";
import { FeedbackBodyParams } from "@/types";
const page = () => {
  const { mutateAsync: createFeedback, isPending } = useCreateFeedback();
  const handleSubmit = async (values: FeedbackBodyParams) => {
    await createFeedback(values);
  };

  return (
    <Wrapper>
      <div className="h-full w-full">
        <FeedbackForm
          type="create"
          onSubmit={handleSubmit}
          isPending={isPending}
        />
      </div>
    </Wrapper>
  );
};

export default page;
