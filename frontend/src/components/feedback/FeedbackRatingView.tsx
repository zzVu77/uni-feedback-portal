import { FeedbackDetail } from "@/types";
import { Star, CheckCircle2, MessageSquareOff } from "lucide-react";
import { Label } from "@/components/ui/label";

export const FeedbackRatingView = ({
  feedback,
}: {
  feedback: FeedbackDetail;
}) => {
  const hasRated =
    feedback.ratingScore !== null && feedback.ratingScore !== undefined;

  if (!hasRated) {
    return (
      <div className="flex max-h-[650px] min-h-[250px] flex-col items-center justify-center rounded-xl border border-gray-200/90 bg-white p-8 text-center sm:p-12">
        <div className="mb-4 rounded-full bg-slate-100 p-4 shadow-inner">
          <MessageSquareOff className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="mb-2 text-lg font-bold text-slate-800">
          Chưa có đánh giá
        </h3>
        <p className="max-w-md text-sm leading-relaxed text-slate-500">
          Sinh viên chưa gửi đánh giá chất lượng hỗ trợ cho phản ánh này.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-4 rounded-[24px] border border-green-100 bg-green-50/30 p-6 shadow-sm sm:p-8">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-green-500" />
          <h3 className="text-lg font-bold text-slate-800">
            Đánh giá từ sinh viên
          </h3>
        </div>
      </div>

      <div className="flex w-full flex-col gap-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            Mức độ hài lòng
          </Label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-6 w-6 ${
                  star <= (feedback.ratingScore || 0)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-slate-100 text-slate-200"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
            Nhận xét chi tiết
          </Label>
          <div className="min-h-[80px] rounded-xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-sm text-slate-700 italic">
              {feedback.comment || "Không có nhận xét chi tiết."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
