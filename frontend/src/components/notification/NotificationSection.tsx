/* eslint-disable @typescript-eslint/no-floating-promises */
"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNotificationFilters } from "@/hooks/filters/useNotificationFilter"; // Import new filter hook
import { useGetInfiniteNotifications } from "@/hooks/queries/useNotificationQueries"; // Import new query hook
import { useUrlTabs } from "@/hooks/useUrlTabs";
import { BellDot, MessageCircle, MessageSquareText } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useInView } from "react-intersection-observer"; // Import Intersection Observer
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

  const {
    data,
    isFetching, // Initial load or filter change
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage, // Loading more data
  } = useGetInfiniteNotifications(filters);

  // 3. Flatten pages into a single array
  const notifications = data?.pages.flatMap((page) => page.results) || [];

  // 4. Ref for intersection observer
  const { ref, inView } = useInView();

  // 5. Trigger fetch next page when scrolling to bottom
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  // Handle URL Params for Tabs (Keep existing logic)
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
    { label: "Đã đọc", value: "true" },
    { label: "Chưa đọc", value: "false" },
  ];

  // Helper to render the list and loading state
  const renderNotificationList = () => (
    <div className="flex h-[65vh] flex-col gap-3 px-2 lg:h-[76vh]">
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} {...notification} />
      ))}

      {/* Loading trigger element */}
      <div ref={ref} className="flex w-full justify-center py-1">
        {isFetchingNextPage && <Loading variant="spinner" />}
      </div>

      {!hasNextPage && notifications.length > 0 && (
        <p className="pb-4 text-center text-sm text-gray-500">
          Đã hiển thị tất cả thông báo.
        </p>
      )}

      {!isFetching && notifications.length === 0 && (
        <p className="mt-10 text-center text-gray-500">
          Chưa có thông báo nào.
        </p>
      )}
    </div>
  );

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
        </div>
      </div>

      {/* Since the API filters data based on the URL 'tab' param via useNotificationFilters,
        we can reuse the same render logic for all TabsContent. 
        The hook automatically refetches when the tab changes.
      */}

      <TabsContent value="all" className="flex h-screen w-full flex-col gap-4">
        <ScrollArea className="overflow-y-auto pr-1">
          {isFetching && !isFetchingNextPage ? (
            <Loading variant="spinner" />
          ) : (
            renderNotificationList()
          )}
        </ScrollArea>
      </TabsContent>

      <TabsContent
        value="feedback"
        className="flex h-screen w-full flex-col gap-4"
      >
        <ScrollArea className="overflow-y-auto pr-1">
          {isFetching && !isFetchingNextPage ? (
            <Loading variant="spinner" />
          ) : (
            renderNotificationList()
          )}
        </ScrollArea>
      </TabsContent>

      <TabsContent
        value="forum"
        className="flex h-screen w-full flex-col gap-4"
      >
        <ScrollArea className="overflow-y-auto pr-1">
          {isFetching && !isFetchingNextPage ? (
            <Loading variant="spinner" />
          ) : (
            renderNotificationList()
          )}
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
};

export default NotificationSection;
