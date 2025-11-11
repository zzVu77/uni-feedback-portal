import ConversationSection from "@/components/conversation/ConversationSection";
import FeedbackDetailHeader from "@/components/feedback/FeedbackDetailHeader";
import FeedbackForm from "@/components/feedback/FeedbackForm";
import { MyFeedbacksHistoryTable } from "@/components/feedback/my-feedbacks-history/MyFeedbacksHistoryTable";
import StatusTimeLine from "@/components/feedback/StatusTimeline";

import PostCard from "@/components/forum/PostCard";
import NotificationItem from "@/components/notification/NotificationItem";

const page = () => {
  return (
    <div className="space-y-3 px-5 py-10">
      <NotificationItem
        isRead={false}
        type="ADMIN_NOTIFICATION"
        time="2025-05-01T12:00:00Z"
      />
      <NotificationItem
        isRead={false}
        type="COMMENT_POST_NOTIFICATION"
        time="2023-03-01T12:00:00Z"
      />
      <NotificationItem
        isRead={false}
        type="FEEDBACK_PROCESSING_NOTIFICATION"
        time="2023-03-01T12:00:00Z"
      />
      <NotificationItem
        isRead={false}
        type="FEEDBACK_RECEIVED_NOTIFICATION"
        time="2023-03-01T12:00:00Z"
      />
      <NotificationItem
        isRead={false}
        type="FEEDBACK_REJECTED_NOTIFICATION"
        time="2023-03-01T12:00:00Z"
      />
      <NotificationItem
        isRead={false}
        type="FEEDBACK_RESOLVED_NOTIFICATION"
        time="2023-03-01T12:00:00Z"
      />
      <NotificationItem
        isRead={false}
        type="FEEDBACK_SUBMITTED_NOTIFICATION"
        time="2023-03-01T12:00:00Z"
      />
      <NotificationItem
        isRead={false}
        type="MESSAGE_NEW_NOTIFICATION"
        time="2023-03-01T12:00:00Z"
      />
      <NotificationItem
        isRead={false}
        type="MESSAGE_SYSTEM_NOTIFICATION"
        time="2023-03-01T12:00:00Z"
      />
      <NotificationItem
        isRead={false}
        type="REPORT_COMMENT_NOTIFICATION"
        time="2023-03-01T12:00:00Z"
      />
      <PostCard />
      <PostCard />
      <PostCard />
      <MyFeedbacksHistoryTable />
      <FeedbackForm />
      <FeedbackDetailHeader />
      <StatusTimeLine />
      <ConversationSection />
    </div>
  );
};

export default page;
