import ConversationSection from "@/components/conversation/ConversationSection";
import FeedbackDetailHeader from "@/components/feedback/FeedbackDetailHeader";
import FeedbackForm from "@/components/feedback/FeedbackForm";
import { MyFeedbacksHistoryTable } from "@/components/feedback/my-feedbacks-history/MyFeedbacksHistoryTable";
import StatusTimeLine from "@/components/feedback/StatusTimeline";

const page = () => {
  return (
    <div className="space-y-3 px-5 py-10">
      <MyFeedbacksHistoryTable />
      <FeedbackForm />
      <FeedbackDetailHeader />
      <StatusTimeLine />
      <ConversationSection />
    </div>
  );
};

export default page;
