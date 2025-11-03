import AnnouncementForm from "@/components/forum/AnnouncementForm";
import Wrapper from "@/components/shared/Wrapper";

const page = () => {
  return (
    <Wrapper>
      <div className="h-[100%] w-full">
        <AnnouncementForm type="edit" />
      </div>
    </Wrapper>
  );
};

export default page;
