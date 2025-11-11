import FeedbackForm from "@/components/feedback/FeedbackForm";
import Wrapper from "@/components/shared/Wrapper";
import React from "react";

const page = () => {
  const feedbackData = {
    subject: "lorem ipsum",
    feedbackCategory: "hoc_lieu",
    location: "A101",
    department: "khoa_dtqt",
    description: "lorem ipsum dolor sit amet",
    isPrivate: true,
    attachments: [],
  };
  return (
    <Wrapper>
      <div className="h-[100%] w-full">
        <FeedbackForm type="edit" initialData={feedbackData} />
      </div>
    </Wrapper>
  );
};

export default page;
