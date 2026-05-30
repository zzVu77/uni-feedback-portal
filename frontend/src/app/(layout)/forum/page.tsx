import { Loading } from "@/components/common/Loading";
import { ForumSection } from "@/components/forum/ForumSection";
import Wrapper from "@/components/shared/Wrapper";
import { Suspense } from "react";

const Page = () => {
  return (
    <Wrapper>
      <div className="w-full">
        <Suspense fallback={<Loading variant="spinner" />}>
          <ForumSection />
        </Suspense>
      </div>
    </Wrapper>
  );
};

export default Page;
