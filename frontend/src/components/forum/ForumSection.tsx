/* eslint-disable @typescript-eslint/no-floating-promises */
"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAnnouncementFilters } from "@/hooks/filters/useAnnouncementFilter";
import { useForumPostFilters } from "@/hooks/filters/useForumPostFilter";
import { useGetInfiniteAnnouncements } from "@/hooks/queries/useAnnouncementQueries";
import { useGetInfiniteForumPosts } from "@/hooks/queries/useForumPostQueries";
import { useUrlTabs } from "@/hooks/useUrlTabs";
import {
  Filter,
  ListFilter,
  Megaphone,
  MessageCircle,
  Plus,
  Search,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import CommonFilter from "../common/CommonFilter";
import { Loading } from "../common/Loading";
import SearchBar from "../common/SearchBar";
import AnnouncementCard from "./AnnouncementCard";
import PostCard from "./PostCard";
import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";

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

  const announcements =
    announcementData?.pages.flatMap((page) => page.results) || [];

  const { ref: announcementRef, inView: inViewAnnouncement } = useInView();

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

  const { ref: forumRef, inView: inViewForum } = useInView();

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
  const { user } = useUser();
  const isShowButtonCreateFeedback =
    user?.role === "STUDENT" && currentTabValue === "feedbacks";
  const isShowButtonCreateAnnouncement =
    user?.role === "DEPARTMENT_STAFF" && currentTabValue === "announcements";
  return (
    <div className="flex min-h-screen w-full flex-col gap-0 bg-slate-50/50">
      {/* 1. Header Section */}
      <div className="mb-2 space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          Diễn đàn
        </h1>
        <p className="max-w-2xl text-lg text-slate-600">
          Nơi chia sẻ, thảo luận và cập nhật thông tin mới nhất từ nhà trường.
        </p>
      </div>

      <Tabs
        value={currentTabValue}
        onValueChange={(value) => handleTabChange(value as ForumTab)}
        defaultValue="feedbacks"
        className="w-full space-y-2"
      >
        {/* 2. Navigation Pills */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <TabsList className="flex h-auto w-fit gap-2 bg-transparent p-0">
            <TabsTrigger
              value="feedbacks"
              className="cursor-pointer rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition-all hover:bg-slate-50 data-[state=active]:border-slate-900 data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-md"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Thảo luận
            </TabsTrigger>
            <TabsTrigger
              value="announcements"
              className="cursor-pointer rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition-all hover:bg-slate-50 data-[state=active]:border-slate-900 data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-md"
            >
              <Megaphone className="mr-2 h-4 w-4" />
              Thông báo
            </TabsTrigger>
          </TabsList>

          {/* Mobile Search & Filter Row */}
          <div className="flex w-full items-center gap-2 md:hidden">
            <Suspense fallback={null}>
              <SearchBar
                placeholder="Tìm kiếm..."
                className="flex-1 rounded-full border border-slate-200 bg-white shadow-sm"
              />
            </Suspense>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-slate-200 shadow-sm"
                >
                  <ListFilter className="h-4 w-4 text-slate-600" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-2xl px-6 pb-8">
                <SheetHeader className="mb-4 px-0 text-left">
                  <SheetTitle className="text-lg font-bold text-slate-900">
                    Bộ lọc tìm kiếm
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 py-2">
                  {currentTabValue === "feedbacks" ? (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                          Danh mục
                        </label>
                        <div className="w-full [&>button]:w-full">
                          <CommonFilter.CategorySelection />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                          Phòng ban
                        </label>
                        <div className="w-full [&>button]:w-full">
                          <CommonFilter.DepartmentSelection />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                          Sắp xếp theo
                        </label>
                        <div className="w-full [&>button]:w-full">
                          <CommonFilter.SortBySelection />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        Phòng ban
                      </label>
                      <div className="w-full [&>button]:w-full">
                        <CommonFilter.DepartmentSelection />
                      </div>
                    </div>
                  )}
                </div>
                <SheetFooter className="mt-4 flex-row gap-3 px-0">
                  <Button
                    variant="ghost"
                    className="flex-1 rounded-xl bg-red-400 text-white"
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
                    <Button className="flex-[2] rounded-xl bg-blue-600 font-semibold hover:bg-blue-700">
                      Xem kết quả
                    </Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* 3. Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* LEFT COLUMN: Main Feed */}
          <div className="flex flex-col gap-6 lg:col-span-8">
            <TabsContent value="feedbacks" className="mt-0 space-y-6">
              {isForumPostsLoading ? (
                <div className="flex h-40 items-center justify-center">
                  <Loading variant="spinner" />
                </div>
              ) : (
                <>
                  {forumPosts.map((forumPost) => (
                    <PostCard
                      key={forumPost.id + forumPost.feedback.id}
                      data={forumPost}
                    />
                  ))}

                  <div
                    ref={forumRef}
                    className="flex w-full justify-center py-6"
                  >
                    {isFetchingNextForumPosts && <Loading variant="spinner" />}
                  </div>

                  {!hasNextForumPosts && forumPosts.length > 0 && (
                    <div className="flex flex-col items-center gap-2 pb-8 text-center">
                      <div className="h-1 w-12 rounded-full bg-slate-200" />
                      <p className="text-sm text-slate-400">
                        Bạn đã xem hết bài viết
                      </p>
                    </div>
                  )}
                  {forumPosts.length === 0 && (
                    <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                        <MessageCircle className="h-8 w-8 text-slate-400" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-medium text-slate-900">
                          Chưa có bài thảo luận nào
                        </h3>
                        <p className="text-sm text-slate-500">
                          Hãy là người đầu tiên chia sẻ ý kiến của mình!
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="announcements" className="mt-0 space-y-6">
              {isAnnouncementsLoading ? (
                <div className="flex h-40 items-center justify-center">
                  <Loading variant="spinner" />
                </div>
              ) : (
                <>
                  {announcements.map((announcement) => (
                    <AnnouncementCard
                      key={announcement.id + announcement.title}
                      announcement={announcement}
                    />
                  ))}

                  <div
                    ref={announcementRef}
                    className="flex w-full justify-center py-6"
                  >
                    {isFetchingNextAnnouncements && (
                      <Loading variant="spinner" />
                    )}
                  </div>

                  {!hasNextAnnouncements && announcements.length > 0 && (
                    <div className="flex flex-col items-center gap-2 pb-8 text-center">
                      <div className="h-1 w-12 rounded-full bg-slate-200" />
                      <p className="text-sm text-slate-400">
                        Bạn đã xem hết thông báo
                      </p>
                    </div>
                  )}
                  {announcements.length === 0 && (
                    <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                        <Megaphone className="h-8 w-8 text-slate-400" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-medium text-slate-900">
                          Chưa có thông báo nào
                        </h3>
                        <p className="text-sm text-slate-500">
                          Hiện tại chưa có thông báo mới từ nhà trường.
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </div>

          {/* RIGHT COLUMN: Sidebar (Desktop) */}
          <div className="hidden w-full space-y-4 lg:col-span-4 lg:block">
            {/* Search & Filter Widget */}
            <div className="sticky top-0 space-y-6">
              <div className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <Search className="h-5 w-5 text-slate-400" />
                  <h3 className="font-semibold text-slate-900">Tìm kiếm</h3>
                </div>
                <Suspense fallback={null}>
                  <SearchBar
                    placeholder="Nhập từ khóa..."
                    className="w-full rounded-xl bg-slate-50"
                  />
                </Suspense>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                    <Filter className="h-4 w-4" />
                    Bộ lọc
                  </div>
                  {currentTabValue === "feedbacks" ? (
                    <div className="w-full space-y-3">
                      <div className="w-full space-y-1.5">
                        <label className="text-xs font-medium text-slate-500">
                          Danh mục
                        </label>
                        <div className="w-full [&>button]:w-full [&>button]:justify-between">
                          <CommonFilter.CategorySelection />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-500">
                          Phòng ban
                        </label>
                        <div className="w-full [&>button]:w-full [&>button]:justify-between">
                          <CommonFilter.DepartmentSelection />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-500">
                          Sắp xếp
                        </label>
                        <div className="w-full [&>button]:w-full [&>button]:justify-between">
                          <CommonFilter.SortBySelection />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-500">
                          Phòng ban
                        </label>
                        <div className="w-full [&>button]:w-full [&>button]:justify-between">
                          <CommonFilter.DepartmentSelection />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Trending Topics Placeholder */}
              {/* <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  <h3 className="font-semibold text-slate-900">
                    Chủ đề nổi bật
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Học phí",
                    "Cơ sở vật chất",
                    "Đăng ký tín chỉ",
                    "Hoạt động ngoại khóa",
                    "Thư viện",
                  ].map((topic) => (
                    <span
                      key={topic}
                      className="cursor-pointer rounded-lg bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                    >
                      # {topic}
                    </span>
                  ))}
                </div>
              </div> */}

              {/* CTA */}
              <Button
                className={cn(
                  "w-full rounded-xl bg-blue-600 py-6 text-base font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-blue-600/30",
                  isShowButtonCreateAnnouncement || isShowButtonCreateFeedback
                    ? ""
                    : "hidden",
                )}
                onClick={() => {
                  if (user?.role === "STUDENT") {
                    router.push("/student/create-new-feedback");
                  } else {
                    router.push("/staff/announcement-management/create");
                  }
                }}
              >
                <Plus className="mr-2 h-5 w-5" />
                {user?.role === "STUDENT" ? "Gửi góp ý" : "Tạo thông báo"}
              </Button>
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
