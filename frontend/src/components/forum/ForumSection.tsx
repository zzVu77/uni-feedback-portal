import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostCard from "./PostCard";
import { Megaphone, MessageCircle } from "lucide-react";
import { Suspense } from "react";
import SearchBar from "../common/SearchBar";
import Filter from "../common/filter/Filter";
import AnnouncementCard from "./AnnouncementCard";

export function ForumSection() {
  const mockCategory = [
    { label: "Tất cả", value: "all" },
    { label: "Parking", value: "parking" },
    { label: "Facilities", value: "facilities" },
    { label: "Cafeteria", value: "cafeteria" },
    { label: "Student Services", value: "student-services" },
  ];
  const sortOptions = [
    { label: "Tất cả", value: "all" },
    { label: "Mới nhất", value: "newest" },
    { label: "Cũ nhất", value: "oldest" },
    { label: "Phổ biến nhất", value: "library" },
  ];
  return (
    <div>
      <Tabs defaultValue="feedbacks" className="flex flex-col gap-4 pb-2">
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
            <Suspense fallback={null}>
              <Filter type="category" items={mockCategory} />
            </Suspense>
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
          <AnnouncementCard />
          <AnnouncementCard />
          <AnnouncementCard />
          <AnnouncementCard />
          <AnnouncementCard />
          <AnnouncementCard />
          <AnnouncementCard />
          <AnnouncementCard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
