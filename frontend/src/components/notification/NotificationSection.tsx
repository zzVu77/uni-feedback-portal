/* eslint-disable @typescript-eslint/no-floating-promises */
"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNotificationFilters } from "@/hooks/filters/useNotificationFilter";
import { useGetInfiniteNotifications } from "@/hooks/queries/useNotificationQueries";
import { useUrlTabs } from "@/hooks/useUrlTabs";
import { BellDot } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useInView } from "react-intersection-observer";
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
  const filters = useNotificationFilters();

  const { data, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetInfiniteNotifications(filters);

  // const { mutate: markAsRead } = useMarkNotificationAsRead();

  const notifications = data?.pages.flatMap((page) => page.results) || [];
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  useEffect(() => {
    const urlTab = searchParams.get(TAB_PARAM_NAME);
    if (!urlTab || !VALID_TABS.includes(urlTab as NotificationTab)) {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set(TAB_PARAM_NAME, DEFAULT_TAB);
      router.replace(`?${newSearchParams.toString()}`, { scroll: false });
    }
  }, [router, searchParams]);

  // const handleMarkAllAsRead = () => {
  //   const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.id);
  //   if (unreadIds.length > 0) {
  //     markAsRead({ ids: unreadIds });
  //   }
  // };

  const mockNotificationStatus = [
    { label: "Tất cả", value: "all" },
    { label: "Đã đọc", value: "true" },
    { label: "Chưa đọc", value: "false" },
  ];

  const renderNotificationList = () => (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} {...notification} />
      ))}

      <div ref={ref} className="flex w-full justify-center py-4">
        {isFetchingNextPage && <Loading variant="spinner" />}
      </div>

      {!hasNextPage && notifications.length > 0 && (
        <p className="py-6 text-center text-sm text-slate-400">
          Bạn đã xem hết thông báo.
        </p>
      )}

      {!isFetching && notifications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <BellDot className="mb-4 h-12 w-12 opacity-20" />
          <p>Chưa có thông báo nào.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center justify-center gap-4">
        <Tabs
          className="w-fit"
          value={currentTabValue}
          onValueChange={(value: string) =>
            handleTabChange(value as NotificationTab)
          }
        >
          <TabsList className="h-11 rounded-full border-none bg-slate-100/80 p-1">
            <TabsTrigger
              value="all"
              className="cursor-pointer rounded-full px-6 transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
            >
              Tất cả
            </TabsTrigger>
            <TabsTrigger
              value="feedback"
              className="cursor-pointer rounded-full px-6 transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
            >
              Góp ý
            </TabsTrigger>
            <TabsTrigger
              value="forum"
              className="cursor-pointer rounded-full px-6 transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
            >
              Diễn đàn
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* <Button
          variant="ghost"
          size="sm"
          onClick={handleMarkAllAsRead}
          className="gap-2 rounded-full text-slate-500 hover:bg-blue-50 hover:text-blue-600"
        >
          <CheckCheck className="h-4 w-4" />
          <span className="hidden sm:inline">Đánh dấu đã đọc tất cả</span>
        </Button> */}
      </div>

      <div className="flex w-full items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Thông báo</h1>
        <Suspense fallback={null}>
          <Filter type="notificationStatus" items={mockNotificationStatus} />
        </Suspense>
      </div>

      <div className="flex h-[80vh] w-full flex-col gap-4">
        <ScrollArea className="h-full pr-4">
          {isFetching && !isFetchingNextPage ? (
            <div className="flex h-40 w-full items-center justify-center">
              <Loading variant="spinner" />
            </div>
          ) : (
            renderNotificationList()
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default NotificationSection;
