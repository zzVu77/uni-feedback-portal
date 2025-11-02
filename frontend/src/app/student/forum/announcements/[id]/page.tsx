import AnnouncementDetail from "@/components/forum/AnnouncementDetail";
import CommentSection from "@/components/forum/CommentSection";
import Wrapper from "@/components/shared/Wrapper";
import React from "react";

const page = () => {
  return (
    <div className="w-full">
      <Wrapper>
        <AnnouncementDetail />
        <CommentSection />
      </Wrapper>
    </div>
  );
};

export default page;
