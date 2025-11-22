"use client";
import AnnouncementForm from "@/components/forum/AnnouncementForm";
import Wrapper from "@/components/shared/Wrapper";
import { useCreateAnnouncement } from "@/hooks/queries/useAnnouncementQueries";
import { CreateAnnouncementPayload } from "@/types";

const page = () => {
  const { mutateAsync: createAnnouncement, isPending } =
    useCreateAnnouncement();
  const handleSubmit = async (values: CreateAnnouncementPayload) => {
    await createAnnouncement(values);
  };
  return (
    <Wrapper>
      <div className="h-full w-full">
        <AnnouncementForm
          onSubmit={handleSubmit}
          type="create"
          isPending={isPending}
        />
      </div>
    </Wrapper>
  );
};

export default page;
