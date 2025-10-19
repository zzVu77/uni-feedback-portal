import MessageItem from "@/components/conversation/MessageItem";
import FeedbackDetailHeader from "@/components/feedback/FeedbackDetailHeader";
import StatusTimeLine from "@/components/feedback/StatusTimeline";

const page = () => {
  return (
    <div className="py-10">
      <FeedbackDetailHeader />
      <StatusTimeLine />
      <div className="flex flex-col gap-4 bg-white p-10">
        <MessageItem
          typeOfUser="STAFF"
          isReceived={true}
          content="Hello, how can I help you?"
          name="John Doe"
          timestamp="10:00 19/10/2025"
        />
        <MessageItem
          typeOfUser="STUDENT"
          isReceived={false}
          content="lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          name="John Doe"
          timestamp="10:00 19/10/2025"
        />
      </div>
    </div>
  );
};

export default page;
