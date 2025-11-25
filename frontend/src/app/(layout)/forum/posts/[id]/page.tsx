"use client";
import { Loading } from "@/components/common/Loading";
import CommentSection from "@/components/forum/CommentSection";
import FeedbackPostDetail from "@/components/forum/FeedbackPostDetail";
import OfficialResponse from "@/components/forum/OfficialResponse";
import Wrapper from "@/components/shared/Wrapper";
import { useGetCommentsByPostId } from "@/hooks/queries/useCommentQueries";
import { useGetForumPostById } from "@/hooks/queries/useForumPostQueries";
import { useIsClient } from "@/hooks/useIsClient";
import { useParams } from "next/navigation";

const page = () => {
  const params = useParams();
  const id = params.id as string;

  const isClient = useIsClient();
  const { data: feedback, isLoading } = useGetForumPostById(id, {
    enabled: isClient,
  });

  // Fetch comments
  const { data: comments } = useGetCommentsByPostId(id, {
    enabled: isClient,
  });

  if (isLoading || !feedback) return <Loading variant="spinner" />;

  return (
    <div className="w-full">
      <Wrapper>
        <FeedbackPostDetail data={feedback} />
        <OfficialResponse
          departmentName="Khoa đào tạo Quốc tế"
          responseContent="Cảm ơn bạn đã góp ý..."
          responseDate="20/11/2023"
        />
        {/* Pass the postId (id) to CommentSection for mutations */}
        <CommentSection postId={id} data={comments?.results ?? []} />
      </Wrapper>
    </div>
  );
};

export default page;
