// src/components/dashboard/TopInteractivePostsTable.tsx
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TopInteractivePostDto } from "@/types/report";
import { MessageSquare, ThumbsUp, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface Props {
  data?: TopInteractivePostDto[];
  isLoading: boolean;
}

export const TopInteractivePostsTable = ({ data, isLoading }: Props) => {
  if (isLoading) {
    return (
      <div className="h-[400px] w-full animate-pulse rounded-xl bg-gray-100" />
    );
  }

  return (
    <Card className="h-full w-full overflow-hidden">
      <CardHeader>
        <CardTitle>Thảo luận nổi bật</CardTitle>
        <CardDescription>
          Top bài đăng nhận được nhiều quan tâm nhất trên diễn đàn
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[50%] pl-6">Chủ đề</TableHead>
              <TableHead className="text-center">Tương tác</TableHead>
              <TableHead className="pr-6 text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((post) => (
              <TableRow key={post.forumPostId}>
                <TableCell className="pl-6 font-medium">
                  <div className="line-clamp-2" title={post.title}>
                    {post.title}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-4 text-sm">
                    {/* Votes - Blue Tone */}
                    <div className="flex items-center gap-1 text-blue-600">
                      <ThumbsUp className="h-4 w-4" />
                      <span className="font-semibold">{post.voteCount}</span>
                    </div>
                    {/* Comments - Neutral/Dark Tone combined with Red accent if high */}
                    <div className="flex items-center gap-1 text-slate-600">
                      <MessageSquare className="h-4 w-4" />
                      <span>{post.commentCount}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="pr-6 text-right">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <Link
                      href={`/forum/posts/${post.forumPostId}`}
                      target="_blank"
                    >
                      Xem chi tiết <ArrowUpRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {data?.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  Chưa có dữ liệu thảo luận
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
