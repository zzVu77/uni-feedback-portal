"use client";
import { Loading } from "@/components/common/Loading";
import AnnouncementDetail from "@/components/forum/AnnouncementDetail";
import CommentSection from "@/components/forum/CommentSection";
import Wrapper from "@/components/shared/Wrapper";
import { useGetAnnouncementById } from "@/hooks/queries/useAnnouncementQueries";
import { useGetCommentsByAnnouncementId } from "@/hooks/queries/useCommentQueries";
import { useIsClient } from "@/hooks/useIsClient";
import { useParams } from "next/navigation";

const page = () => {
  const params = useParams();
  const id = params.id as string;
  const isClient = useIsClient();
  const { data: announcement, isLoading: isAnnouncementLoading } =
    useGetAnnouncementById(id, {
      enabled: isClient,
    });
  // Fetch comments
  const { data: comments, isLoading: isCommentsLoading } =
    useGetCommentsByAnnouncementId(id, {
      enabled: isClient,
    });
  if (isAnnouncementLoading || !announcement)
    return <Loading variant="spinner" />;
  if (isCommentsLoading || !comments) return <Loading variant="spinner" />;
  return (
    <div className="w-full">
      <Wrapper>
        <AnnouncementDetail data={announcement} />
        {isCommentsLoading || !comments ? (
          <Loading variant="spinner" />
        ) : (
          <CommentSection
            type="announcement"
            postId={id}
            data={comments?.results ?? []}
          />
        )}
      </Wrapper>
    </div>
  );
};

export default page;
