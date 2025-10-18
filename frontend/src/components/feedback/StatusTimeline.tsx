import { History, NotebookPen } from "lucide-react";
import StatusBadge from "../common/StatusBadge";

const StatusTimeLine = () => {
  const timelineData = [
    {
      status: "PENDING",
      date: "01.07.2021",
      title: "Góp ý đã được gửi thành công cho Thư viện.",
    },

    {
      status: "IN_PROGRESS",
      date: "13.09.2021",
      title: "Góp ý của bạn đã được tiếp nhận và đang được xử lý bởi Thư viện",
      message:
        "Libero expedita explicabo eius fugiat quia aspernatur autem laudantium error architecto recusandae natus sapiente sit nam eaque, consectetur porro molestiae ipsam an deleniti.",
    },
    {
      status: "RESOLVED",
      date: "25.11.2021",
      title: "Góp ý của bạn đã được xử lý xong.",
      message:
        "Libero expedita explicabo eius fugiat quia aspernatur autem laudantium error architecto recusandae natus sapiente sit nam eaque, consectetur porro molestiae ipsam an deleniti.",
    },
  ];
  return (
    <div className="flex h-full flex-col items-start justify-center gap-4 rounded-[8px] bg-white px-8 py-4">
      {/* Timeline header */}
      <div className="flex h-full flex-row items-center gap-1">
        <History className="text-neutral-dark-primary-700 h-6 w-6" />
        <h2 className="text-neutral-dark-primary-700 text-[18px] font-medium">
          Lịch sử trạng thái
        </h2>
      </div>
      {/* Timeline content */}
      <div className="w-full px-6">
        <ol className="relative border-l border-blue-400">
          {timelineData.map((item, index) => (
            <TimeLineItem
              key={index}
              date={item.date}
              title={item.title}
              message={item.message ?? ""}
              status={item.status as "PENDING" | "IN_PROGRESS" | "RESOLVED"}
            />
          ))}
        </ol>
      </div>
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
      <span className="ring-neutral-light-primary-200/80 absolute -left-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 ring-6 transition-colors duration-200 group-hover:bg-blue-400">
        <div className="h-2 w-2 rounded-full bg-blue-400 transition-colors duration-200 group-hover:bg-white" />
      </span>
      <div className="bg-neutral-light-primary-100 flex flex-col gap-1 rounded-[8px] p-4 shadow-sm transition-shadow duration-200 hover:scale-101 hover:shadow-md">
        {/* Status and date */}
        <div className="flex flex-col items-start justify-between gap-1 md:flex-row md:items-center">
          <StatusBadge type={status} />
          <span className="text-neutral-dark-primary-500 text-sm font-normal">
            {date}
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
                Admin note:
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
