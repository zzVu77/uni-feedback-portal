import ConversationSection from "@/components/conversation/ConversationSection";
import StaffAction from "@/components/feedback/staff-feedbacks-list/StaffAction";
import StatusTimeLine from "@/components/feedback/StatusTimeline";
import Wrapper from "@/components/shared/Wrapper";

const Page = () => {
  return (
    <Wrapper classNames={{ container: "lg:px-4" }}>
      <div className="grid grid-cols-1 gap-x-5 gap-y-8 pb-3 lg:grid-cols-2">
        <div className="col-span-1 flex w-full flex-col items-start justify-between gap-2 lg:col-span-2 lg:flex-row">
          {/* <FeedbackDetailHeader type="staff" /> */}
          <StaffAction />
        </div>
        <StatusTimeLine />
        <ConversationSection />
      </div>
    </Wrapper>
  );
};

export default Page;
