import { Loading } from "@/components/common/Loading";
import { ListAllFeedbacks } from "@/components/feedback/admin-feedbacks-list/ListAllFeedbacks";
import Wrapper from "@/components/shared/Wrapper";
import { Suspense } from "react";

const page = () => {
  return (
    <Wrapper>
      <Suspense fallback={<Loading variant="spinner" />}>
        <ListAllFeedbacks />
      </Suspense>
    </Wrapper>
  );
};

export default page;
