/* eslint-disable @typescript-eslint/no-floating-promises */
"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAnnouncementFilters } from "@/hooks/filters/useAnnouncementFilter";
import { useForumPostFilters } from "@/hooks/filters/useForumPostFilter";
import { useUrlTabs } from "@/hooks/useUrlTabs";
import { Megaphone, MessageCircle, ListFilter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useInView } from "react-intersection-observer"; // Import Intersection Observer
import CommonFilter from "../common/CommonFilter";
import { Loading } from "../common/Loading";
import SearchBar from "../common/SearchBar";
import AnnouncementCard from "./AnnouncementCard";
import PostCard from "./PostCard";
import { useGetInfiniteAnnouncements } from "@/hooks/queries/useAnnouncementQueries";
import { useGetInfiniteForumPosts } from "@/hooks/queries/useForumPostQueries";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

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

  const searchParams = useSearchParams();
  const router = useRouter();

  // --- Logic for Announcements ---
  const announcementFilters = useAnnouncementFilters();
  const {
    data: announcementData,
    isLoading: isAnnouncementsLoading,
    fetchNextPage: fetchNextAnnouncements,
    hasNextPage: hasNextAnnouncements,
    isFetchingNextPage: isFetchingNextAnnouncements,
  } = useGetInfiniteAnnouncements(announcementFilters);

  // Flatten the pages into a single array of results
  const announcements =
    announcementData?.pages.flatMap((page) => page.results) || [];

  // Ref for intersection observer (Announcements)
  const { ref: announcementRef, inView: inViewAnnouncement } = useInView();

  // Trigger fetch next page when scrolling to bottom (Announcements)
  useEffect(() => {
    if (inViewAnnouncement && hasNextAnnouncements) {
      fetchNextAnnouncements();
    }
  }, [inViewAnnouncement, hasNextAnnouncements, fetchNextAnnouncements]);

  // --- Logic for Forum Posts (Feedbacks) ---
  const forumPostFilters = useForumPostFilters();
  const {
    data: forumData,
    isLoading: isForumPostsLoading,
    fetchNextPage: fetchNextForumPosts,
    hasNextPage: hasNextForumPosts,
    isFetchingNextPage: isFetchingNextForumPosts,
  } = useGetInfiniteForumPosts(forumPostFilters);

  const forumPosts = forumData?.pages.flatMap((page) => page.results) || [];

  // Ref for intersection observer (Feedbacks)
  const { ref: forumRef, inView: inViewForum } = useInView();

  // Trigger fetch next page when scrolling to bottom (Feedbacks)
  useEffect(() => {
    if (inViewForum && hasNextForumPosts) {
      fetchNextForumPosts();
    }
  }, [inViewForum, hasNextForumPosts, fetchNextForumPosts]);

  // Handle URL Params for Tabs
  useEffect(() => {
    const urlTab = searchParams.get(TAB_PARAM_NAME);
    if (!urlTab || !VALID_TABS.includes(urlTab as ForumTab)) {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set(TAB_PARAM_NAME, DEFAULT_TAB);
      router.replace(`?${newSearchParams.toString()}`, { scroll: false });
    }
  }, [router, searchParams]);

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

        <div className="flex w-full items-center gap-3">
          <Suspense fallback={null}>
            <SearchBar
              placeholder="Tìm kiếm theo tiêu đề..."
              className="flex-1"
            />
          </Suspense>

          {/* Desktop Filters */}
          <div className="hidden items-center gap-3 md:flex">
            {currentTabValue === "feedbacks" ? (
              <>
                <CommonFilter.CategorySelection />
                <CommonFilter.DepartmentSelection />
                <CommonFilter.SortBySelection />
              </>
            ) : (
              <CommonFilter.DepartmentSelection />
            )}
          </div>

          {/* Mobile Filter Drawer */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <ListFilter className="h-4 w-4" />
                  Bộ lọc
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-xl px-6 pb-8">
                <SheetHeader className="px-0 text-left">
                  <SheetTitle className="text-lg font-bold text-slate-800">
                    Bộ lọc tìm kiếm
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 py-4">
                  {currentTabValue === "feedbacks" ? (
                    <>
                      <div className="flex flex-col gap-1.5">
                        <span className="ml-1 text-sm font-medium text-slate-700">
                          Danh mục
                        </span>
                        <div className="w-full [&>button]:w-full">
                          <CommonFilter.CategorySelection />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="ml-1 text-sm font-medium text-slate-700">
                          Phòng ban
                        </span>
                        <div className="w-full [&>button]:w-full">
                          <CommonFilter.DepartmentSelection />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="ml-1 text-sm font-medium text-slate-700">
                          Sắp xếp theo
                        </span>
                        <div className="w-full [&>button]:w-full">
                          <CommonFilter.SortBySelection />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col gap-1.5">
                      <span className="ml-1 text-sm font-medium text-slate-700">
                        Phòng ban
                      </span>
                      <div className="w-full [&>button]:w-full">
                        <CommonFilter.DepartmentSelection />
                      </div>
                    </div>
                  )}
                </div>
                <SheetFooter className="flex-row items-center gap-3 px-0 pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 flex-1 bg-red-400 text-white"
                    onClick={() => {
                      const params = new URLSearchParams(
                        searchParams.toString(),
                      );
                      params.delete("categoryId");
                      params.delete("departmentId");
                      params.delete("sortBy");
                      params.delete("q");
                      params.delete("page");
                      router.replace(`?${params.toString()}`, {
                        scroll: false,
                      });
                    }}
                  >
                    Xóa bộ lọc
                  </Button>
                  <SheetClose asChild>
                    <Button className="h-10 flex-[2] bg-blue-600 hover:bg-blue-700">
                      Xem kết quả
                    </Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* --- FEEDBACKS CONTENT --- */}
        <TabsContent
          value="feedbacks"
          className="flex min-h-screen w-full flex-col gap-4"
        >
          {isForumPostsLoading ? (
            <Loading variant="spinner" />
          ) : (
            <>
              {forumPosts.map((forumPost) => (
                <PostCard
                  key={forumPost.id + forumPost.feedback.id}
                  data={forumPost}
                />
              ))}

              {/* Loading trigger element */}
              <div ref={forumRef} className="flex w-full justify-center py-4">
                {isFetchingNextForumPosts && <Loading variant="spinner" />}
              </div>

              {!hasNextForumPosts && forumPosts.length > 0 && (
                <p className="pb-4 text-center text-sm text-gray-500">
                  Đã hiển thị tất cả bài đăng.
                </p>
              )}
              {forumPosts.length === 0 && (
                <p className="mt-10 text-center text-gray-500">
                  Chưa có bài viết nào.
                </p>
              )}
            </>
          )}
        </TabsContent>

        {/* --- ANNOUNCEMENTS CONTENT --- */}
        <TabsContent
          value="announcements"
          className="flex min-h-screen w-full flex-col gap-4"
        >
          {isAnnouncementsLoading ? (
            <Loading variant="spinner" />
          ) : (
            <>
              {announcements.map((announcement) => (
                <AnnouncementCard
                  key={announcement.id + announcement.title}
                  announcement={announcement}
                />
              ))}

              {/* Loading trigger element */}
              <div
                ref={announcementRef}
                className="flex w-full justify-center py-4"
              >
                {isFetchingNextAnnouncements && <Loading variant="spinner" />}
              </div>

              {!hasNextAnnouncements && announcements.length > 0 && (
                <p className="pb-4 text-center text-sm text-gray-500">
                  Đã hiển thị tất cả thông báo.
                </p>
              )}
              {announcements.length === 0 && (
                <p className="mt-10 text-center text-gray-500">
                  Chưa có thông báo nào.
                </p>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
