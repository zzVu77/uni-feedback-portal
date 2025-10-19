import ConversationSection from "@/components/conversation/ConversationSection";
import FeedbackDetailHeader from "@/components/feedback/FeedbackDetailHeader";
import StatusTimeLine from "@/components/feedback/StatusTimeline";

const page = () => {
  return (
    <div className="py-10">
      <FeedbackDetailHeader />
      <StatusTimeLine />
      <ConversationSection />
    </div>
  );
};

export default page;
