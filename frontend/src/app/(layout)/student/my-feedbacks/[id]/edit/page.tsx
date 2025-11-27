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
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react"; // 1. Import useMemo
import { toast } from "sonner";

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isClient = useIsClient();

  const { mutateAsync: updateFeedback, isPending } = useUpdateFeedbackById();
  const { data: feedback, isLoading } = useGetMyFeedbackById(id, {
    enabled: isClient,
  });

  // --- GUARD LOGIC ---
  useEffect(() => {
    if (feedback) {
      if (feedback.currentStatus !== "PENDING") {
        toast.error(
          `Bạn chỉ có thể chỉnh sửa góp ý khi đang ở trạng thái "Đang chờ xử lý."`,
        );
        router.push(`/student/my-feedbacks/${id}`);
      }
    }
  }, [feedback, router, id]);

  const initialData = useMemo(() => {
    if (!feedback) return undefined;
    return mapFeedbackDetailToBodyParams(feedback);
  }, [feedback]);

  if (isLoading || !feedback) return <Loading variant="spinner" />;

  // Prevent rendering the form momentarily while redirecting
  if (feedback.currentStatus !== "PENDING") {
    return <Loading variant="spinner" />;
  }

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

export default Page;
