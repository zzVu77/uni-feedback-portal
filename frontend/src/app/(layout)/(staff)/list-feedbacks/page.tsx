import { Loading } from "@/components/common/Loading";
import { ListDepartmentFeedback } from "@/components/feedback/staff-feedbacks-list/ListDepartmentFeedback";
import Wrapper from "@/components/shared/Wrapper";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Wrapper>
      <Suspense fallback={<Loading variant="spinner" />}>
        <ListDepartmentFeedback />
      </Suspense>
    </Wrapper>
  );
};

export default page;
