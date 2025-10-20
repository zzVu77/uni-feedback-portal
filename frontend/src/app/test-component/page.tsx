import ConversationSection from "@/components/conversation/ConversationSection";
import FeedbackDetailHeader from "@/components/feedback/FeedbackDetailHeader";
import FeedbackForm from "@/components/feedback/FeedbackForm";
import StatusTimeLine from "@/components/feedback/StatusTimeline";

const page = () => {
  return (
    <div className="space-y-3 px-20 py-10">
      <FeedbackForm />
      <FeedbackDetailHeader />
      <StatusTimeLine />
      <ConversationSection />
    </div>
  );
};

export default page;
