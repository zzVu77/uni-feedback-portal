import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import StatusBadge from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ReportedComment } from "@/types";
import { DialogTitle } from "@radix-ui/react-dialog";
import {
  Calendar,
  Check,
  ExternalLink,
  MessageSquare,
  MessageSquareReply,
  MessageSquareWarning,
  Trash,
  User,
} from "lucide-react";
import Link from "next/link";
import React from "react";
type Props = {
  children: React.ReactNode;
  data: ReportedComment;
};
const ReportCommentDetailDialog = ({ children, data }: Props) => {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="py-2 lg:h-[80vh] lg:w-full">
          <DialogTitle></DialogTitle>
          <ScrollArea className="w-full overflow-y-auto pr-1">
            <div className="flex h-[60vh] flex-col gap-4 px-2">
              {/* Comment Detail */}
              <div className="flex flex-col gap-2">
                <div className="flex flex-row items-center justify-start gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-500/80" />
                  <span className="text-lg font-bold text-blue-500/80">
                    Chi tiết bình luận
                  </span>
                  <Link href={`forum/posts/${data.post.id}`}>
                    <ExternalLink className="h-5 w-5 text-blue-500/80" />
                  </Link>
                </div>
                <div className="bg-blue-primary-50 flex flex-col gap-2 rounded-md p-2 shadow-xs">
                  {/* Comment detail */}
                  <div className="flex flex-row items-center justify-between">
                    <span className="text-[16px] font-medium">
                      {data.comment.content}
                    </span>
                    <div className="flex flex-row items-center justify-start gap-0.5">
                      <Calendar className="h-4 w-4" />
                      <time className="text-[14px]">
                        {new Date(data.comment.createdAt).toLocaleString("vi")}
                      </time>
                    </div>
                  </div>
                  <div className="flex flex-row items-center justify-start gap-0.5">
                    <User className="h-4 w-4 text-gray-500/80" />
                    <span className="text-[14px] font-medium text-gray-500/80">
                      {data.comment.user.fullName}
                    </span>
                  </div>
                </div>
              </div>
              {/* Report Information */}
              <div className="flex flex-col gap-2">
                <div className="flex flex-row items-center justify-start gap-2">
                  <MessageSquareWarning className="h-5 w-5 text-red-500/80" />
                  <span className="text-lg font-bold text-red-500/80">
                    Thông tin báo cáo
                  </span>
                </div>
                <div className="flex flex-col gap-2 rounded-md bg-red-100/20 p-2 shadow-xs">
                  <StatusBadge type={data.status} />
                  <p className="text-[14px]">
                    <span className="font-medium">Báo cáo bởi: </span>
                    {data.reportedBy.fullName}
                  </p>
                  <div className="flex flex-row items-center justify-start gap-0.5">
                    <span className="text-[14px] font-medium">Thời gian: </span>
                    <time className="text-[14px]">
                      {new Date(data.createdAt).toLocaleString("vi")}
                    </time>
                  </div>
                  <p className="text-[14px]">
                    <span className="font-medium">Lý do: </span>
                    {data.reason}
                  </p>
                </div>
              </div>
              {/* Admin reply */}
              <div className="flex flex-col gap-2">
                <div className="flex flex-row items-center justify-start gap-2">
                  <MessageSquareReply className="h-5 w-5 text-green-500/80" />
                  <span className="text-lg font-bold text-green-500/80">
                    Phản hồi của bạn
                  </span>
                </div>
                <div className="flex flex-col gap-2 rounded-md bg-green-100/20 p-2 shadow-xs">
                  <span>
                    {data.adminResponse ??
                      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Unde, molestiae minima distinctio vero et, excepturi sed id cupiditate optio dolor error harum, adipisci quisquam ab mollitia quibusdam! Maiores, nam nemo."}
                  </span>
                </div>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <ConfirmationDialog
              title="Xác nhận bình luận này không vi phạm?"
              description="Hành động này sẽ đánh dấu bình luận này là không vi phạm. Bạn có muốn tiếp tục không?"
              onConfirm={() => {}}
              confirmText="Đồng ý"
            >
              <Button
                variant="primary"
                className="bg-green-500 hover:bg-green-600"
              >
                <Check className="h-4 w-4" />
                Không vi phạm
              </Button>
            </ConfirmationDialog>
            <ConfirmationDialog
              title="Xác nhận xóa bình luận?"
              description="Hành động này sẽ ẩn bình luận khỏi hệ thống. Bạn có muốn tiếp tục không?"
              onConfirm={() => {}}
              confirmText="Đồng ý"
            >
              <Button variant="cancel">
                <Trash className="h-4 w-4" />
                Xóa bình luận
              </Button>
            </ConfirmationDialog>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportCommentDetailDialog;
