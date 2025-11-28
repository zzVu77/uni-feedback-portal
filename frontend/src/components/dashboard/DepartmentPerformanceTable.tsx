// src/components/dashboard/DepartmentPerformanceTable.tsx
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { TopDepartmentStatsDto } from "@/types/report";
import { Progress } from "@/components/ui/progress";

interface Props {
  data?: TopDepartmentStatsDto[];
  isLoading: boolean;
}

export const DepartmentPerformanceTable = ({ data, isLoading }: Props) => {
  if (isLoading)
    return (
      <div className="h-[400px] w-full animate-pulse rounded-xl bg-gray-100" />
    );

  // Find max count to calculate percentage
  const maxCount = data ? Math.max(...data.map((d) => d.feedbackCount)) : 100;

  return (
    <Card className="h-full w-full">
      <CardHeader>
        <CardTitle>Hiệu suất phòng ban</CardTitle>
        <CardDescription>
          Số lượng tiếp nhận và thời gian xử lý trung bình
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full">
        <div className="space-y-6">
          {data?.map((dept, index) => (
            <div key={index} className="flex items-center">
              <div className="w-full space-y-1">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span>{dept.departmentName}</span>
                  <span className="text-muted-foreground">
                    {dept.feedbackCount} góp ý
                  </span>
                </div>
                {/* Override Progress color to Blue-600 using indicator class if supported or wrapper color */}
                <Progress
                  value={(dept.feedbackCount / maxCount) * 100}
                  className="h-2 [&>div]:bg-blue-600"
                />
                <p className="text-muted-foreground pt-1 text-xs">
                  Thời gian xử lý trung bình:{" "}
                  <span className="text-foreground font-semibold">
                    {dept.avgResolutionTimeHours.toFixed(1)} giờ
                  </span>
                </p>
              </div>
            </div>
          ))}
          {data?.length === 0 && (
            <p className="text-muted-foreground py-8 text-center">
              Chưa có dữ liệu
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
