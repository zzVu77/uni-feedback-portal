"use client";
import { Loading } from "@/components/common/Loading";
import FeedbackForm from "@/components/feedback/FeedbackForm";
import Wrapper from "@/components/shared/Wrapper";
import {
  useGetMyFeedbackById,
  useUpdateFeedbackById,
} from "@/hooks/queries/useFeedbackQueries";
import { useIsClient } from "@/hooks/useIsClient";
import { CreateFeedbackPayload } from "@/types";
import { mapFeedbackDetailToBodyParams } from "@/utils/mappers";
import { useParams } from "next/navigation";

const page = () => {
  const params = useParams();
  const id = params.id as string;
  const isClient = useIsClient();
  const { mutateAsync: updateFeedback, isPending } = useUpdateFeedbackById();
  const { data: feedback, isLoading } = useGetMyFeedbackById(id, {
    enabled: isClient,
  });
  if (isLoading || !feedback) return <Loading variant="spinner" />;
  const initialData = mapFeedbackDetailToBodyParams(feedback);
  const handleSubmit = async (values: CreateFeedbackPayload) => {
    await updateFeedback({ id, data: values });
  };
  return (
    <Wrapper>
      <div className="h-full w-full">
        <FeedbackForm
          type="edit"
          initialData={initialData}
          onSubmit={handleSubmit}
          isPending={isPending}
        />
      </div>
    </Wrapper>
  );
};

export default page;
