import FeedbackForm from "@/components/feedback/FeedbackForm";
import Wrapper from "@/components/shared/Wrapper";
import React from "react";

const page = () => {
  return (
    <Wrapper>
      <div className="h-[100%] w-full">
        <FeedbackForm />
      </div>
    </Wrapper>
  );
};

export default page;
