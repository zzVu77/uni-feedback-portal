import FeedbackPostDetail from "@/components/forum/FeedbackPostDetail";
import OfficialResponse from "@/components/forum/OfficialResponse";
import Wrapper from "@/components/shared/Wrapper";
import React from "react";

const page = () => {
  return (
    <Wrapper>
      <FeedbackPostDetail />
      <OfficialResponse />
    </Wrapper>
  );
};

export default page;
