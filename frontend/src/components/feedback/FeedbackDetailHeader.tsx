import { useDeleteFeedbackById } from "@/hooks/queries/useFeedbackQueries";
import { FeedbackHeaderType } from "@/types";
import {
  Building2,
  Calendar,
  MapPin,
  SquarePen,
  Tag,
  Trash2,
  User,
} from "lucide-react";
import Link from "next/link";
import ConfirmationDialog from "../common/ConfirmationDialog";
import StatusBadge, { StatusBadgeProps } from "../common/StatusBadge";
import { Badge } from "../ui/badge"; // Import Badge
import { Button } from "../ui/button";
import Attachment from "./Attachment";

type Props = {
  type: "student" | "staff" | "admin";
  data: FeedbackHeaderType;
};

const FeedbackDetailHeader = ({ type = "student", data }: Props) => {
  const {
    subject,
    category,
    createdAt,
    currentStatus,
    department,
    description,
    id,
    isPrivate,
    location,
    fileAttachments,
  } = data;
  const { mutateAsync: deleteFeedback, isPending } = useDeleteFeedbackById();
  const handleDelete = async () => {
    await deleteFeedback(id);
    setTimeout(() => {
      window.location.href = "/student/my-feedbacks";
    }, 1000);
  };
  return (
    <>
      <div className="flex h-full w-full flex-col gap-4 rounded-xl bg-white px-4 py-4 shadow-xs lg:px-8">
        {/* Title */}
        <div className="flex flex-col items-start justify-between gap-1 md:flex-row lg:gap-4">
          <h1 className="order-2 text-[16px] font-bold text-black md:order-1 lg:text-[24px]">
            {subject ||
              `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sit
           ratione dicta quia. Inventore animi qui expedita accusamus ex
           voluptates dignissimos officia molestiae! Rerum mollitia distinctio
           consequuntur molestias, veniam illum dolores.
           `}
          </h1>
          {type === "student" && currentStatus === "PENDING" && (
            <div className="order-1 flex flex-row items-center gap-2 md:order-2">
              <Link href={`/student/my-feedbacks/${id}/edit`}>
                <Button className="h-fit border bg-gray-100/70 p-2 text-xs font-normal text-black shadow-xs hover:bg-gray-100">
                  <SquarePen className="h-4 w-4 text-black" />
                  Sửa
                </Button>
              </Link>
              <ConfirmationDialog
                title="Xác nhận xóa"
                description="Bạn có chắc chắn muốn xóa phản hồi này không? Hành động này không thể hoàn tác."
                onConfirm={handleDelete}
                confirmText="Xóa"
                cancelText="Hủy"
              >
                <Button
                  className="h-fit border bg-red-500 p-2 text-xs font-normal text-white shadow-xs hover:bg-red-400"
                  disabled={isPending}
                >
                  <Trash2 className="h-4 w-4 text-white" />
                  Xóa
                </Button>
              </ConfirmationDialog>
            </div>
          )}
        </div>

        {/* Information */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Badge */}
          <StatusBadge type={currentStatus as StatusBadgeProps["type"]} />
          {/* 1. Date Badge */}
          <Badge
            variant="secondary"
            className="flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-slate-600 hover:bg-slate-200"
          >
            <Calendar className="h-3.5 w-3.5" />
            <span className="font-normal">
              {new Date(createdAt).toLocaleDateString("vi-VN")}
            </span>
          </Badge>
          {/* 2. Sender or Department Badge */}
          {(type === "staff" || type === "admin") && (
            <Badge
              variant="secondary"
              className="text-bg-fuchsia-700 flex items-center gap-1.5 rounded-md bg-fuchsia-50 px-2.5 py-1 hover:bg-fuchsia-100"
            >
              <User className="h-3.5 w-3.5" />
              <span className="font-normal">
                {isPrivate
                  ? "Ẩn danh"
                  : data.student?.fullName || "Nguyễn Văn A"}
              </span>
            </Badge>
          )}
          {(type === "staff" || type === "student") && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1.5 rounded-md bg-indigo-50 px-2.5 py-1 text-indigo-700 hover:bg-indigo-100"
            >
              <Building2 className="h-3.5 w-3.5" />
              <span className="font-normal">
                {department.name || "Phòng Quản trị hệ thống"}
              </span>
            </Badge>
          )}
          {/* 3. Category Badge */}
          <Badge
            variant="secondary"
            className="flex items-center gap-1.5 rounded-md bg-orange-50 px-2.5 py-1 text-orange-700 hover:bg-orange-100"
          >
            <Tag className="h-3.5 w-3.5" />
            <span className="font-normal">
              {category.name || "Cơ sở vật chất"}
            </span>
          </Badge>
          {/* 4. Location Badge (Conditional) */}
          {location && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-emerald-700 hover:bg-emerald-100"
            >
              <MapPin className="h-3.5 w-3.5" />
              <span className="font-normal">{location}</span>
            </Badge>
          )}
        </div>
        {/* Description */}
        <div>
          <h2 className="text-[18px] font-medium">Nội dung:</h2>
          <p className="text-[13px] font-normal text-black lg:text-[14px]">
            {description ||
              " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."}
          </p>
        </div>
        {/* Attachments */}
        {fileAttachments && fileAttachments.length > 0 && (
          <>
            <h2 className="mt-2 text-[18px] font-medium">Tệp đính kèm:</h2>
            <div className="flex flex-col gap-2">
              {fileAttachments.map((attachment, index) => (
                <Attachment
                  key={index}
                  fileName={attachment.fileName}
                  fileUrl={attachment.fileUrl}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default FeedbackDetailHeader;
