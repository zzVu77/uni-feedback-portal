import ConversationSection from "@/components/conversation/ConversationSection";
import FeedbackDetailHeader from "@/components/feedback/FeedbackDetailHeader";
import StatusTimeLine from "@/components/feedback/StatusTimeline";

const Page = () => {
  return (
    <div className="grid grid-cols-1 gap-x-5 gap-y-8 px-2 lg:grid-cols-2 lg:px-12">
      <div className="col-span-1 w-full lg:col-span-2">
        <FeedbackDetailHeader />
      </div>
      <StatusTimeLine />
      <ConversationSection />
    </div>
  );
};

export default Page;
