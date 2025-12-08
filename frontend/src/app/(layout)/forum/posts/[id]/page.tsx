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
  const { data: forumDetail, isLoading: isFeedbackLoading } =
    useGetForumPostById(id, {
      enabled: isClient,
    });

  // Fetch comments
  const { data: comments, isLoading: isCommentsLoading } =
    useGetCommentsByPostId(id, {
      enabled: isClient,
    });

  if (isFeedbackLoading || !forumDetail) return <Loading variant="spinner" />;

  return (
    <div className="w-full">
      <Wrapper>
        <FeedbackPostDetail data={forumDetail} />
        {forumDetail.feedback.officialResponse !== null && (
          <OfficialResponse
            departmentName={forumDetail.feedback.department.name}
            responseContent={forumDetail.feedback.officialResponse.content}
            responseDate={forumDetail.feedback.officialResponse.createdAt}
          />
        )}

        {isCommentsLoading || !comments ? (
          <Loading variant="spinner" />
        ) : (
          <CommentSection
            type="feedback"
            postId={id}
            data={comments?.results ?? []}
          />
        )}
      </Wrapper>
    </div>
  );
};

export default page;
