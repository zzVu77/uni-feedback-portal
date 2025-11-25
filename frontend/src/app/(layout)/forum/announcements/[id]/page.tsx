"use client";
import { Loading } from "@/components/common/Loading";
import AnnouncementDetail from "@/components/forum/AnnouncementDetail";
import Wrapper from "@/components/shared/Wrapper";
import { useGetAnnouncementById } from "@/hooks/queries/useAnnouncementQueries";
import { useIsClient } from "@/hooks/useIsClient";
import { useParams } from "next/navigation";

const page = () => {
  const params = useParams();
  const id = params.id as string;
  const isClient = useIsClient();
  const { data, isLoading } = useGetAnnouncementById(id, {
    enabled: isClient,
  });
  if (isLoading || !data) return <Loading variant="spinner" />;
  return (
    <div className="w-full">
      <Wrapper>
        <AnnouncementDetail data={data} />
        {/* <CommentSection /> */}
      </Wrapper>
    </div>
  );
};

export default page;
