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
import { useUser } from "@/context/UserContext";
import { useAnnouncementFilters } from "@/hooks/filters/useAnnouncementFilter";
import { useForumPostFilters } from "@/hooks/filters/useForumPostFilter";
import { useGetInfiniteAnnouncements } from "@/hooks/queries/useAnnouncementQueries";
import { useGetInfiniteForumPosts } from "@/hooks/queries/useForumPostQueries";
import { useUrlTabs } from "@/hooks/useUrlTabs";
import { cn } from "@/lib/utils";
import {
  Filter,
  ListFilter,
  Megaphone,
  MessageCircle,
  Plus,
  Search,
  Share2,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import CommonFilter from "../common/CommonFilter";
import { Loading } from "../common/Loading";
import SearchBar from "../common/SearchBar";
import AnnouncementCard from "./AnnouncementCard";
import PostCard from "./PostCard";

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
    <div className="flex min-h-screen w-full flex-col bg-slate-50/50 pb-20">
      {/* 1. Header Section - Premium Banner Style */}
      <div className="relative mb-6 overflow-hidden rounded-[32px] bg-white px-8 py-8 shadow-sm ring-1 ring-slate-200/50">
        <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-blue-100 opacity-50 blur-3xl" />
        <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-purple-100 opacity-50 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-2 py-1.5 text-sm font-semibold text-blue-700 ring-1 ring-blue-200/50">
            <Share2 className="h-4 w-4" />
            <span>Kết nối & Chia sẻ</span>
          </div>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
            Diễn đàn sinh viên
          </h1>
          <p className="max-w-2xl text-lg font-medium text-slate-500 md:text-xl">
            Nơi thảo luận, trao đổi ý kiến và cập nhật những thông báo mới nhất
            từ nhà trường.
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl">
        <Tabs
          value={currentTabValue}
          onValueChange={(value) => handleTabChange(value as ForumTab)}
          defaultValue="feedbacks"
          className="w-full space-y-8"
        >
          {/* 2. Navigation Pills & Mobile Actions */}
          <div className="flex flex-col items-center justify-center gap-4 md:items-center xl:flex-row">
            <TabsList className="inline-flex h-auto w-full items-center justify-start gap-2 rounded-full bg-slate-200/50 p-1.5 shadow-inner sm:w-fit">
              <TabsTrigger
                value="feedbacks"
                className="flex-1 cursor-pointer rounded-full px-6 py-2.5 text-sm font-bold text-slate-600 transition-all data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm sm:flex-none"
              >
                <MessageCircle className="mr-2 h-4.5 w-4.5" />
                Thảo luận
              </TabsTrigger>
              <TabsTrigger
                value="announcements"
                className="flex-1 cursor-pointer rounded-full px-6 py-2.5 text-sm font-bold text-slate-600 transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm sm:flex-none"
              >
                <Megaphone className="mr-2 h-4.5 w-4.5" />
                Thông báo
              </TabsTrigger>
            </TabsList>

            {/* Mobile Search & Filter Row */}
            <div className="flex w-full items-center gap-3 xl:hidden">
              <Suspense fallback={null}>
                <SearchBar
                  placeholder="Tìm kiếm..."
                  className="flex-1 rounded-full border border-slate-200 bg-white shadow-sm ring-offset-white focus-within:ring-2 focus-within:ring-indigo-500/50"
                />
              </Suspense>
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-11 w-11 shrink-0 rounded-full border-slate-200 bg-white shadow-sm hover:bg-slate-50 hover:text-indigo-600"
                  >
                    <ListFilter className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="bottom"
                  className="rounded-t-[32px] px-6 pb-8"
                >
                  <SheetHeader className="mb-0 px-0 pt-2 pb-0 text-left">
                    <SheetTitle className="text-xl font-extrabold text-slate-900">
                      Bộ lọc tìm kiếm
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-6 py-4">
                    {currentTabValue === "feedbacks" ? (
                      <>
                        <div className="space-y-2.5">
                          <label className="text-sm font-bold text-slate-700">
                            Danh mục
                          </label>
                          <div className="w-full [&>button]:h-11 [&>button]:w-full [&>button]:rounded-xl">
                            <CommonFilter.CategorySelection />
                          </div>
                        </div>
                        <div className="space-y-2.5">
                          <label className="text-sm font-bold text-slate-700">
                            Phòng ban
                          </label>
                          <div className="w-full [&>button]:h-11 [&>button]:w-full [&>button]:rounded-xl">
                            <CommonFilter.DepartmentSelection />
                          </div>
                        </div>
                        <div className="space-y-2.5">
                          <label className="text-sm font-bold text-slate-700">
                            Sắp xếp theo
                          </label>
                          <div className="w-full [&>button]:h-11 [&>button]:w-full [&>button]:rounded-xl">
                            <CommonFilter.SortBySelection />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-2.5">
                        <label className="text-sm font-bold text-slate-700">
                          Phòng ban
                        </label>
                        <div className="w-full [&>button]:h-11 [&>button]:w-full [&>button]:rounded-xl">
                          <CommonFilter.DepartmentSelection />
                        </div>
                      </div>
                    )}
                  </div>
                  <SheetFooter className="mt-6 flex-row gap-3 px-0">
                    <Button
                      variant="ghost"
                      className="h-12 flex-1 rounded-2xl bg-rose-50 font-bold text-rose-600 hover:bg-rose-100"
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
                      <Button className="h-12 flex-[2] rounded-2xl bg-indigo-600 font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700">
                        Xem kết quả
                      </Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* 3. Main Content Grid */}
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
            {/* LEFT COLUMN: Main Feed */}
            <div className="flex flex-col gap-6 lg:col-span-8 xl:col-span-9">
              <TabsContent value="feedbacks" className="mt-0 space-y-6">
                {isForumPostsLoading ? (
                  <div className="flex h-60 flex-col items-center justify-center gap-4 rounded-[24px] bg-white ring-1 ring-slate-200/50">
                    <Loading variant="spinner" />
                    <span className="text-sm font-medium text-slate-500">
                      Đang tải thảo luận...
                    </span>
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
                      {isFetchingNextForumPosts && (
                        <Loading variant="spinner" />
                      )}
                    </div>

                    {!hasNextForumPosts && forumPosts.length > 0 && (
                      <div className="flex flex-col items-center gap-3 pt-4 pb-8 text-center">
                        <div className="h-1.5 w-12 rounded-full bg-slate-200" />
                        <p className="text-sm font-medium text-slate-400">
                          Bạn đã xem hết bài viết
                        </p>
                      </div>
                    )}
                    {forumPosts.length === 0 && (
                      <div className="flex flex-col items-center justify-center gap-5 rounded-[32px] border border-dashed border-slate-300 bg-white/50 py-16 text-center shadow-sm">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 ring-8 ring-indigo-50/50">
                          <MessageCircle className="h-10 w-10 text-indigo-400" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-bold text-slate-900">
                            Chưa có bài thảo luận nào
                          </h3>
                          <p className="text-base text-slate-500">
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
                  <div className="flex h-60 flex-col items-center justify-center gap-4 rounded-[24px] bg-white ring-1 ring-slate-200/50">
                    <Loading variant="spinner" />
                    <span className="text-sm font-medium text-slate-500">
                      Đang tải thông báo...
                    </span>
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
                      <div className="flex flex-col items-center gap-3 pt-4 pb-8 text-center">
                        <div className="h-1.5 w-12 rounded-full bg-slate-200" />
                        <p className="text-sm font-medium text-slate-400">
                          Bạn đã xem hết thông báo
                        </p>
                      </div>
                    )}
                    {announcements.length === 0 && (
                      <div className="flex flex-col items-center justify-center gap-5 rounded-[32px] border border-dashed border-slate-300 bg-white/50 py-16 text-center shadow-sm">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 ring-8 ring-blue-50/50">
                          <Megaphone className="h-10 w-10 text-blue-400" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-bold text-slate-900">
                            Chưa có thông báo nào
                          </h3>
                          <p className="text-base text-slate-500">
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
            <div className="hidden w-full lg:col-span-4 xl:col-span-3 xl:block">
              <div className="sticky top-6 flex flex-col gap-6">
                {/* CTA Button */}
                <Button
                  className={cn(
                    "group relative w-full overflow-hidden rounded-[20px] bg-gradient-to-r from-indigo-600 to-blue-600 p-0 shadow-xl shadow-indigo-600/25 transition-all hover:-translate-y-1 hover:shadow-indigo-600/40",
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
                  <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="flex h-14 w-full items-center justify-center gap-2 px-6">
                    <Plus className="h-5 w-5 text-white" />
                    <span className="text-[17px] font-extrabold text-white">
                      {user?.role === "STUDENT"
                        ? "Gửi góp ý mới"
                        : "Tạo thông báo"}
                    </span>
                  </div>
                </Button>

                {/* Search & Filter Widget */}
                <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-200/50">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                      <Search className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Tìm kiếm
                    </h3>
                  </div>

                  <Suspense fallback={null}>
                    <SearchBar
                      placeholder="Nhập từ khóa..."
                      className="h-12 w-full rounded-[16px] bg-slate-50 transition-colors focus-within:bg-white"
                    />
                  </Suspense>

                  <div className="mt-8 space-y-5">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2 text-[15px] font-bold text-slate-800">
                      <Filter className="h-4.5 w-4.5 text-indigo-600" />
                      Lọc kết quả
                    </div>

                    {currentTabValue === "feedbacks" ? (
                      <div className="w-full space-y-4">
                        <div className="w-full space-y-2">
                          <label className="text-sm font-semibold text-slate-600">
                            Danh mục
                          </label>
                          <div className="w-full [&>button]:h-11 [&>button]:w-full [&>button]:justify-between [&>button]:rounded-xl">
                            <CommonFilter.CategorySelection />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-600">
                            Phòng ban
                          </label>
                          <div className="w-full [&>button]:h-11 [&>button]:w-full [&>button]:justify-between [&>button]:rounded-xl">
                            <CommonFilter.DepartmentSelection />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-600">
                            Sắp xếp
                          </label>
                          <div className="w-full [&>button]:h-11 [&>button]:w-full [&>button]:justify-between [&>button]:rounded-xl">
                            <CommonFilter.SortBySelection />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-600">
                            Phòng ban
                          </label>
                          <div className="w-full [&>button]:h-11 [&>button]:w-full [&>button]:justify-between [&>button]:rounded-xl">
                            <CommonFilter.DepartmentSelection />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
