"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetAllAnnouncement } from "@/hooks/queries/useAnnouncementQueries";
import { useUrlTabs } from "@/hooks/useUrlTabs";
import { Megaphone, MessageCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import CommonFilter from "../common/CommonFilter";
import { Loading } from "../common/Loading";
import SearchBar from "../common/SearchBar";
import Filter from "../common/filter/Filter";
import AnnouncementCard from "./AnnouncementCard";
import PostCard from "./PostCard";
import { useAnnouncementFilters } from "@/hooks/filters/useAnnouncementFilter";

type ForumTab = "feedbacks" | "announcements";

export function ForumSection() {
  const TAB_PARAM_NAME = "tab";
  const VALID_TABS = ["feedbacks", "announcements"] as const;
  const DEFAULT_TAB: ForumTab = "feedbacks";

  const { currentTabValue, handleTabChange } = useUrlTabs<ForumTab>(
    TAB_PARAM_NAME,
    VALID_TABS,
    DEFAULT_TAB,
  );
  const filters = useAnnouncementFilters();
  const { data: announcements, isLoading } = useGetAllAnnouncement(filters);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const urlTab = searchParams.get(TAB_PARAM_NAME);
    if (!urlTab || !VALID_TABS.includes(urlTab as ForumTab)) {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set(TAB_PARAM_NAME, DEFAULT_TAB);
      router.replace(`?${newSearchParams.toString()}`, { scroll: false });
    }
  }, [router, searchParams]);

  // const mockCategory = [
  //   { label: "Tất cả", value: "all" },
  //   { label: "Parking", value: "parking" },
  //   { label: "Facilities", value: "facilities" },
  //   { label: "Cafeteria", value: "cafeteria" },
  //   { label: "Student Services", value: "student-services" },
  // ];
  const sortOptions = [
    { label: "Tất cả", value: "all" },
    { label: "Mới nhất", value: "newest" },
    { label: "Cũ nhất", value: "oldest" },
    { label: "Phổ biến nhất", value: "library" },
  ];
  return (
    <div>
      <Tabs
        value={currentTabValue}
        onValueChange={(value) => handleTabChange(value as ForumTab)}
        defaultValue="feedbacks"
        className="flex w-full flex-col gap-4 pb-2"
      >
        <TabsList className="h-auto w-full border-2 bg-white px-2 py-1 shadow-lg">
          <TabsTrigger
            value="feedbacks"
            className="data-[state=active]:bg-neutral-dark-primary-800 cursor-pointer text-sm font-bold transition-all duration-200 ease-in-out data-[state=active]:text-white data-[state=active]:shadow-xs lg:text-lg"
          >
            <MessageCircle />
            Góp ý
          </TabsTrigger>
          <TabsTrigger
            value="announcements"
            className="data-[state=active]:bg-neutral-dark-primary-800 cursor-pointer text-sm font-bold transition-all duration-200 ease-in-out data-[state=active]:text-white data-[state=active]:shadow-xs lg:text-lg"
          >
            <Megaphone />
            Thông báo
          </TabsTrigger>
        </TabsList>
        <div className="flex w-full flex-col items-start justify-between gap-2 md:flex-row md:items-center">
          <Suspense fallback={null}>
            <SearchBar placeholder="Tìm kiếm theo tiêu đề..." />
          </Suspense>
          <div className="flex w-full flex-row items-center justify-center gap-2 md:w-auto">
            {currentTabValue === "feedbacks" ? (
              <CommonFilter.CategorySelection />
            ) : (
              <CommonFilter.DepartmentSelection />
            )}
            <Suspense fallback={null}>
              <Filter type="sort" items={sortOptions} />
            </Suspense>
          </div>
        </div>
        <TabsContent
          value="feedbacks"
          className="flex h-screen w-full flex-col gap-4"
        >
          <PostCard />
          <PostCard />
          <PostCard />
          <PostCard />
          <PostCard />
          <PostCard />
          <PostCard />
          <PostCard />
        </TabsContent>
        <TabsContent
          value="announcements"
          className="flex h-screen w-full flex-col gap-4"
        >
          {isLoading && <Loading variant="spinner" />}
          {announcements?.results.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
