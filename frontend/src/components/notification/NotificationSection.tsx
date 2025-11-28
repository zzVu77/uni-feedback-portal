"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetAllNotifications } from "@/hooks/queries/useNotificationQueries";
import { useUrlTabs } from "@/hooks/useUrlTabs";
import { BellDot, MessageCircle, MessageSquareText } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import Filter from "../common/filter/Filter";
import { Loading } from "../common/Loading";
import { ScrollArea } from "../ui/scroll-area";
import NotificationItem from "./NotificationItem";
type NotificationTab = "all" | "feedback" | "forum";
const NotificationSection = () => {
  const TAB_PARAM_NAME = "tab";
  const VALID_TABS = ["all", "feedback", "forum"] as const;
  const DEFAULT_TAB: NotificationTab = "all";

  const { currentTabValue, handleTabChange } = useUrlTabs<NotificationTab>(
    TAB_PARAM_NAME,
    VALID_TABS,
    DEFAULT_TAB,
  );

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const urlTab = searchParams.get(TAB_PARAM_NAME);
    if (!urlTab || !VALID_TABS.includes(urlTab as NotificationTab)) {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set(TAB_PARAM_NAME, DEFAULT_TAB);
      router.replace(`?${newSearchParams.toString()}`, { scroll: false });
    }
  }, [router, searchParams]);

  const mockNotificationStatus = [
    { label: "Tất cả", value: "all" },
    { label: "Đã đọc", value: "read" },
    { label: "Chưa đọc", value: "unread" },
  ];
  const sortOptions = [
    { label: "Tất cả", value: "all" },
    { label: "Mới nhất", value: "newest" },
    { label: "Cũ nhất", value: "oldest" },
  ];
  const { data: notifications, isFetching } = useGetAllNotifications();
  return (
    <Tabs
      className="flex w-full flex-col gap-4 pb-2"
      value={currentTabValue}
      onValueChange={(value: string) =>
        handleTabChange(value as NotificationTab)
      }
    >
      <TabsList className="h-auto w-full border-2 bg-white px-2 py-1 shadow-lg">
        <TabsTrigger
          value="all"
          className="data-[state=active]:bg-neutral-dark-primary-800 cursor-pointer text-sm font-bold text-black/70 transition-all duration-200 ease-in-out data-[state=active]:text-white data-[state=active]:shadow-xs lg:text-lg"
        >
          <BellDot />
          Tất cả
        </TabsTrigger>
        <TabsTrigger
          value="feedback"
          className="data-[state=active]:bg-neutral-dark-primary-800 cursor-pointer text-sm font-bold text-black/70 transition-all duration-200 ease-in-out data-[state=active]:text-white data-[state=active]:shadow-xs lg:text-lg"
        >
          <MessageSquareText />
          Góp ý
        </TabsTrigger>
        <TabsTrigger
          value="forum"
          className="data-[state=active]:bg-neutral-dark-primary-800 cursor-pointer text-sm font-bold text-black/70 transition-all duration-200 ease-in-out data-[state=active]:text-white data-[state=active]:shadow-xs lg:text-lg"
        >
          <MessageCircle />
          Diễn đàn
        </TabsTrigger>
      </TabsList>
      <div className="flex w-full flex-col items-start justify-between gap-2 md:flex-row md:items-center md:justify-center lg:justify-start">
        <div className="flex w-full flex-row items-center justify-center gap-2 md:justify-end">
          <Suspense fallback={null}>
            <Filter type="notificationStatus" items={mockNotificationStatus} />
          </Suspense>
          <Suspense fallback={null}>
            <Filter type="sort" items={sortOptions} />
          </Suspense>
        </div>
      </div>

      <TabsContent value="all" className="flex h-screen w-full flex-col gap-4">
        <ScrollArea className="overflow-y-auto pr-1">
          {isFetching ? (
            <Loading variant="spinner" />
          ) : (
            <div className="flex h-[65vh] flex-col gap-4 px-2 lg:h-[76vh]">
              {notifications?.results.map((notification) => (
                <NotificationItem key={notification.id} {...notification} />
              ))}
            </div>
          )}
        </ScrollArea>
      </TabsContent>
      <TabsContent
        value="feedback"
        className="flex h-screen w-full flex-col gap-4"
      >
        <ScrollArea className="overflow-y-auto pr-1">
          {/* <div className="flex h-[65vh] flex-col gap-4 px-2 lg:h-[76vh]">
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
              isRead={true}
              type="FEEDBACK_PROCESSING_NOTIFICATION"
              time="2023-03-01T12:00:00Z"
            />
            <NotificationItem
              isRead={true}
              type="FEEDBACK_RECEIVED_NOTIFICATION"
              time="2023-03-01T12:00:00Z"
            />
            <NotificationItem
              isRead={true}
              type="FEEDBACK_REJECTED_NOTIFICATION"
              time="2023-03-01T12:00:00Z"
            />
            <NotificationItem
              isRead={true}
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
          </div> */}
        </ScrollArea>
      </TabsContent>
      <TabsContent
        value="forum"
        className="flex h-screen w-full flex-col gap-4"
      >
        <ScrollArea className="overflow-y-auto pr-1">
          {/* <div className="flex h-[65vh] flex-col gap-4 px-2 lg:h-[76vh]">
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
              isRead={true}
              type="FEEDBACK_PROCESSING_NOTIFICATION"
              time="2023-03-01T12:00:00Z"
            />
            <NotificationItem
              isRead={true}
              type="FEEDBACK_RECEIVED_NOTIFICATION"
              time="2023-03-01T12:00:00Z"
            />
            <NotificationItem
              isRead={true}
              type="FEEDBACK_REJECTED_NOTIFICATION"
              time="2023-03-01T12:00:00Z"
            />
            <NotificationItem
              isRead={true}
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
          </div> */}
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
};

export default NotificationSection;
