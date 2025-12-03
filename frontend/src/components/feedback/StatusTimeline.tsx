import { History, Hourglass, NotebookPen } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import { ScrollArea } from "../ui/scroll-area";
import { FeedbackDetail } from "@/types";

const StatusTimeLine = ({
  statusHistory,
}: {
  statusHistory: FeedbackDetail["statusHistory"];
}) => {
  return (
    <div className="flex max-h-[650px] min-h-[250px] flex-col items-start justify-start gap-4 rounded-xl bg-white px-8 py-4 shadow-xs">
      {/* Timeline header */}
      <div className="flex flex-row items-center gap-1">
        <History className="text-neutral-dark-primary-700 h-6 w-6" />
        <h2 className="text-neutral-dark-primary-700 text-[18px] font-medium">
          Lịch sử trạng thái
        </h2>
      </div>
      {/* Timeline content */}
      <ScrollArea className="w-full overflow-y-auto">
        {statusHistory.length === 0 ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-center">
            <div className="flex h-12 w-12 animate-spin items-center justify-center rounded-full bg-gray-50">
              <Hourglass className="h-6 w-6 text-gray-400" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-center text-[15px] font-medium text-neutral-400">
                Chưa có cập nhật nào
              </span>
              <p className="text-xs text-gray-500">
                Hệ thống chưa ghi nhận thay đổi trạng thái cho phản hồi này.
              </p>
            </div>
          </div>
        ) : (
          <div className="h-full max-h-[50vh] w-full px-6 pt-4">
            <ol className="relative border-l border-blue-400">
              {statusHistory.map((item, index) => (
                <TimeLineItem
                  key={index}
                  date={item.createdAt}
                  title={item.message}
                  message={item.note ?? ""}
                  status={item.status as "PENDING" | "IN_PROGRESS" | "RESOLVED"}
                />
              ))}
            </ol>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
export default StatusTimeLine;
const TimeLineItem = ({
  date,
  title,
  message,
  status,
}: {
  date: string;
  title: string;
  message: string;
  status: "PENDING" | "IN_PROGRESS" | "RESOLVED";
}) => {
  return (
    <li className="group mb-5 ml-6 bg-transparent">
      <span className="ring-neutral-light-primary-200/80 absolute -left-2 flex h-4 w-4 items-center justify-center rounded-full bg-white ring-6 transition-colors duration-200 group-hover:bg-blue-400">
        <div className="h-2 w-2 rounded-full bg-blue-400 transition-colors duration-200 group-hover:bg-white" />
      </span>
      <div className="bg-neutral-light-primary-100 flex flex-col gap-1 rounded-xl p-4 shadow-sm transition-shadow duration-200 hover:scale-101 hover:shadow-md">
        {/* Status and date */}
        <div className="flex flex-col items-start justify-between gap-1 md:flex-row md:items-center">
          <StatusBadge type={status} />
          <span className="text-neutral-dark-primary-500 text-xs font-normal">
            {new Date(date).toLocaleString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </span>
        </div>
        {/* Title */}
        <h3 className="flex items-center text-[14px] font-normal text-gray-900">
          {title}
        </h3>
        {/* Message */}
        {message && (
          <div className="flex flex-col gap-1 rounded-[6px] bg-white p-2 shadow-xs">
            <div className="flex w-full flex-row items-center gap-1">
              <NotebookPen className="text-neutral-dark-primary-600 h-3 w-3" />
              <span className="text-neutral-dark-primary-500 text-xs font-normal">
                Ghi chú:
              </span>
            </div>
            <p className="text-neutral-dark-primary-700 mb-4 text-sm">
              {message}
            </p>
          </div>
        )}
      </div>
    </li>
  );
};
