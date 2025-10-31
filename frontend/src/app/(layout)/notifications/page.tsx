import NotificationSection from "@/components/notification/NotificationSection";
import Wrapper from "@/components/shared/Wrapper";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Wrapper>
      <Suspense fallback={<div>Loading notifications...</div>}>
        <NotificationSection />
      </Suspense>
    </Wrapper>
  );
};

export default page;
