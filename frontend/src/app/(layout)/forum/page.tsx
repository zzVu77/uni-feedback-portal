import { ForumSection } from "@/components/forum/ForumSection";
import Wrapper from "@/components/shared/Wrapper";
import { Suspense } from "react";

const Page = () => {
  return (
    <Wrapper>
      <Suspense fallback={<div>Loading forum...</div>}>
        <ForumSection />
      </Suspense>
    </Wrapper>
  );
};

export default Page;
