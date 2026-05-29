// src/components/dashboard/TopInteractivePostsTable.tsx
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TopInteractivePostDto } from "@/types/report";
import { ArrowUpRight, Flame, MessageSquare, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Props {
  data?: TopInteractivePostDto[];
  isLoading: boolean;
}

export const TopInteractivePostsTable = ({ data, isLoading }: Props) => {
  if (isLoading) {
    return (
      <div className="h-[400px] w-full animate-pulse rounded-2xl bg-slate-200/60" />
    );
  }

  const getRankBadge = (index: number) => {
    switch (index) {
      case 0:
        return "bg-amber-100 text-amber-700 border-amber-200 shadow-amber-100/50"; // Gold
      case 1:
        return "bg-slate-100 text-slate-700 border-slate-200 shadow-slate-100/50"; // Silver
      case 2:
        return "bg-orange-100 text-orange-800 border-orange-200 shadow-orange-100/50"; // Bronze
      default:
        return "bg-slate-50 text-slate-500 border-slate-100"; // Others
    }
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ring-1 ring-slate-200/50">
      <div className="flex flex-col gap-1 border-b border-slate-100 bg-slate-50/50 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 shadow-sm ring-1 ring-orange-200/50">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold tracking-tight text-slate-900">
              Thảo luận nổi bật
            </h3>
            <p className="mt-0.5 text-sm font-medium text-slate-500">
              Top bài đăng nhận được nhiều quan tâm nhất
            </p>
          </div>
        </div>
      </div>

      <div className="w-full flex-1 overflow-auto">
        <Table className="w-full min-w-[550px]">
          <TableHeader className="sticky top-0 z-10 bg-slate-50/80 backdrop-blur-md">
            <TableRow className="border-b border-slate-100 hover:bg-transparent">
              <TableHead className="w-[55%] py-4 pl-6 font-semibold text-slate-600">
                Chủ đề
              </TableHead>
              <TableHead className="py-4 text-center font-semibold text-slate-600">
                Tương tác
              </TableHead>
              <TableHead className="py-4 pr-6 text-right font-semibold text-slate-600">
                Hành động
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="w-full">
            {data?.map((post, index) => (
              <TableRow
                key={post.forumPostId}
                className="group border-b border-slate-50 transition-all hover:bg-slate-50/80"
              >
                <TableCell className="py-4 pl-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold shadow-sm transition-transform group-hover:scale-110",
                        getRankBadge(index),
                      )}
                    >
                      {index + 1}
                    </div>
                    <div
                      className="line-clamp-2 text-sm leading-snug font-semibold text-slate-700 transition-colors group-hover:text-indigo-700"
                      title={post.title}
                    >
                      {post.title}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center justify-center gap-3 text-sm">
                    <div className="flex items-center gap-1.5 rounded-full border border-indigo-100/50 bg-indigo-50/80 px-2.5 py-1 text-indigo-700 transition-colors group-hover:border-indigo-200 group-hover:bg-indigo-100">
                      <ThumbsUp className="h-3.5 w-3.5" />
                      <span className="font-semibold">{post.voteCount}</span>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-full border border-slate-200/50 bg-slate-100/80 px-2.5 py-1 text-slate-700 transition-colors group-hover:border-slate-300 group-hover:bg-slate-200">
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span className="font-semibold">{post.commentCount}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4 pr-6 text-right">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="border-slate-200 text-slate-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow"
                  >
                    <Link
                      href={`/forum/posts/${post.forumPostId}`}
                      target="_blank"
                    >
                      <span className="hidden sm:inline">Xem chi tiết</span>
                      <span className="sm:hidden">Xem</span>
                      <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {(!data || data.length === 0) && (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="h-32 text-center font-medium text-slate-500"
                >
                  Chưa có dữ liệu thảo luận
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
