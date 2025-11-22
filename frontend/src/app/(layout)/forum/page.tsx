import { ForumSection } from "@/components/forum/ForumSection";
import Wrapper from "@/components/shared/Wrapper";
import { Suspense } from "react";

const Page = () => {
  return (
    <Wrapper>
      <div className="w-full">
        <Suspense fallback={<div>Loading forum...</div>}>
          <ForumSection />
        </Suspense>
      </div>
    </Wrapper>
  );
};

export default Page;
