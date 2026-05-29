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

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ring-1 ring-slate-200/50">
      <div className="flex flex-col gap-1 border-b border-slate-100 bg-slate-50/50 p-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
            <Flame className="h-4 w-4" />
          </div>
          <h3 className="text-lg font-bold tracking-tight text-slate-900">
            Thảo luận nổi bật
          </h3>
        </div>
        <p className="pl-10 text-sm font-medium text-slate-500">
          Top bài đăng nhận được nhiều quan tâm nhất trên diễn đàn
        </p>
      </div>

      <div className="w-full flex-1 overflow-auto">
        <Table className="w-full">
          <TableHeader className="sticky top-0 z-10 bg-slate-50/50 backdrop-blur-sm">
            <TableRow className="border-b border-slate-100 hover:bg-transparent">
              <TableHead className="w-[50%] py-4 pl-6 font-semibold text-slate-600">
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
            {data?.map((post) => (
              <TableRow
                key={post.forumPostId}
                className="border-b border-slate-50 transition-colors hover:bg-slate-50/80"
              >
                <TableCell className="pl-6 font-medium">
                  <div
                    className="line-clamp-2 text-slate-700"
                    title={post.title}
                  >
                    {post.title}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5 rounded-full border border-indigo-100/50 bg-indigo-50 px-2.5 py-1 text-indigo-700">
                      <ThumbsUp className="h-3.5 w-3.5" />
                      <span className="font-semibold">{post.voteCount}</span>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-full border border-slate-200/50 bg-slate-100 px-2.5 py-1 text-slate-700">
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span className="font-semibold">{post.commentCount}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="pr-6 text-right">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="border-slate-200 text-slate-600 shadow-sm hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                  >
                    <Link
                      href={`/forum/posts/${post.forumPostId}`}
                      target="_blank"
                    >
                      Xem chi tiết{" "}
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
                  className="h-32 text-center text-slate-500"
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
