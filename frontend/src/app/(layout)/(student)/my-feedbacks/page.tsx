import { Loading } from "@/components/common/Loading";
import { MyFeedbacksHistoryTable } from "@/components/feedback/my-feedbacks-history/MyFeedbacksHistoryTable";
import Wrapper from "@/components/shared/Wrapper";
import React, { Suspense } from "react";

const Page = () => {
  return (
    <Wrapper>
      <Suspense fallback={<Loading variant="fullscreen" />}>
        <MyFeedbacksHistoryTable />
      </Suspense>
    </Wrapper>
  );
};

export default Page;
