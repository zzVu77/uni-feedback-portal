/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";
import { Loading } from "@/components/common/Loading";
import AnnouncementForm from "@/components/forum/AnnouncementForm";
import Wrapper from "@/components/shared/Wrapper";
import {
  useGetAnnouncementByIdForStaff,
  useUpdateAnnouncementById,
} from "@/hooks/queries/useAnnouncementQueries"; // Adjust path if needed
import { useIsClient } from "@/hooks/useIsClient";
import { CreateAnnouncementPayload } from "@/types";
import { useParams } from "next/navigation";
import { useMemo } from "react"; // 1. Import useMemo

const page = () => {
  const params = useParams();
  const id = params.id as string;
  const isClient = useIsClient();

  const { data: announcement, isLoading } = useGetAnnouncementByIdForStaff(id, {
    enabled: isClient,
  });

  const { mutateAsync: updateAnnouncement, isPending } =
    useUpdateAnnouncementById(id);

  // 2. Use useMemo to stabilize initialData
  const initialData = useMemo(() => {
    return announcement;
  }, [announcement]);

  if (isLoading || !announcement) return <Loading variant="spinner" />;

  const handleSubmit = async (values: CreateAnnouncementPayload) => {
    await updateAnnouncement(values);
  };

  return (
    <Wrapper>
      <div className="h-full w-full">
        <AnnouncementForm
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
