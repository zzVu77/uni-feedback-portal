import FeedbackForm from "@/components/feedback/FeedbackForm";
import Wrapper from "@/components/shared/Wrapper";
import React from "react";

const page = () => {
  return (
    <Wrapper>
      <div className="h-full w-full">
        <FeedbackForm type="create" />
      </div>
    </Wrapper>
  );
};

export default page;
