"use client";
import { Loading } from "@/components/common/Loading";
import AnnouncementForm from "@/components/forum/AnnouncementForm";
import Wrapper from "@/components/shared/Wrapper";
import {
  useGetAnnouncementById,
  useUpdateAnnouncementById,
} from "@/hooks/queries/useAnnouncementQueries";
import { useIsClient } from "@/hooks/useIsClient";
import { CreateAnnouncementPayload } from "@/types";
import { useParams } from "next/navigation";

const page = () => {
  const params = useParams();
  const id = params.id as string;
  const isClient = useIsClient();
  const { data: announcement, isLoading } = useGetAnnouncementById(id, {
    enabled: isClient,
  });
  const { mutateAsync: updateAnnouncement } = useUpdateAnnouncementById(id);
  if (isLoading || !announcement) return <Loading variant="spinner" />;
  const handleSubmit = async (values: CreateAnnouncementPayload) => {
    await updateAnnouncement(values);
  };
  return (
    <Wrapper>
      <div className="h-full w-full">
        <AnnouncementForm
          type="edit"
          initialData={announcement}
          onSubmit={handleSubmit}
        />
      </div>
    </Wrapper>
  );
};

export default page;
