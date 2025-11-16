import { MyFeedbacksHistoryTable } from "@/components/feedback/my-feedbacks-history/MyFeedbacksHistoryTable";
import Wrapper from "@/components/shared/Wrapper";
import React, { Suspense } from "react";

const Page = () => {
  return (
    <Wrapper>
      <Suspense fallback={<div>Loading...</div>}>
        <MyFeedbacksHistoryTable />
      </Suspense>
    </Wrapper>
  );
};

export default Page;
