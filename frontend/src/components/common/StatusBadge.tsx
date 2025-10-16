import { CircleAlert, CircleCheckBig, CircleX, Clock3 } from "lucide-react";
import { Badge } from "../ui/badge";
type StatusBadgeProps = {
  type: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "REJECTED";
};
const StatusBadge = ({ type }: StatusBadgeProps) => {
  switch (type) {
    case "PENDING":
      return (
        <Badge className="text-yellow-primary-500 bg-yellow-primary-100 py-1 ">
          <CircleAlert className="text-yellow-primary-300 font-bold" /> Đang đợi
        </Badge>
      );
    case "IN_PROGRESS":
      return (
        <Badge className="text-blue-primary-700 bg-blue-primary-100 py-1 ">
          <Clock3 className="text-blue-primary-300 font-bold" /> Đang xử lý
        </Badge>
      );
    case "RESOLVED":
      return (
        <Badge className="text-green-primary-500 bg-green-primary-100 py-1 ">
          <CircleCheckBig className="text-green-primary-300 font-bold" /> Đã xử
          lý
        </Badge>
      );
    case "REJECTED":
      return (
        <Badge className="text-red-primary-500 bg-red-primary-300 py-1 ">
          <CircleX className="text-red-primary-400 font-bold" /> Từ chối
        </Badge>
      );
    default:
      return (
        <Badge className="text-yellow-primary-500 bg-yellow-primary-100 py-1 ">
          <CircleAlert className="text-yellow-primary-300 font-bold" /> Đang đợi
          xử lý
        </Badge>
      );
  }
};

export default StatusBadge;
