import { Loading } from "@/components/common/Loading";
import NotificationSection from "@/components/notification/NotificationSection";
import Wrapper from "@/components/shared/Wrapper";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Wrapper>
      <Suspense fallback={<Loading variant="spinner" />}>
        <NotificationSection />
      </Suspense>
    </Wrapper>
  );
};

export default page;
