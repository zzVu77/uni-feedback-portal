"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitFeedbackRating } from "@/hooks/queries/useFeedbackQueries";
import { FeedbackDetail } from "@/types";
import { Loader2, Star, CheckCircle2 } from "lucide-react";
import React, { useState } from "react";

const SAMPLE_MESSAGES = [
  "Hỗ trợ rất nhanh chóng",
  "Giải quyết thỏa đáng",
  "Cần cải thiện tốc độ xử lý",
  "Chưa giải quyết triệt để vấn đề",
];

interface FeedbackRatingFormProps {
  feedback: FeedbackDetail;
}

export const FeedbackRatingForm: React.FC<FeedbackRatingFormProps> = ({
  feedback,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState("");

  const { mutate: submitRating, isPending } = useSubmitFeedbackRating();

  const isEligibleToRate =
    feedback.currentStatus === "RESOLVED" ||
    feedback.currentStatus === "REJECTED";

  const hasRated =
    feedback.ratingScore !== null && feedback.ratingScore !== undefined;

  const handleSampleMessageClick = (msg: string) => {
    setComment(msg);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    submitRating({
      id: feedback.id,
      data: {
        ratingScore: rating,
        comment: comment.trim() || undefined,
      },
    });
  };

  if (!isEligibleToRate) {
    return (
      <div className="flex max-h-[650px] min-h-[250px] w-full flex-col items-center justify-center rounded-xl border border-gray-200/90 bg-white px-3 py-4 text-center shadow-xs md:px-8">
        <div className="mb-4 rounded-full bg-slate-100 p-4 shadow-inner">
          <Star className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="mb-2 text-lg font-bold text-slate-800">
          Chưa thể đánh giá
        </h3>
        <p className="max-w-md text-sm leading-relaxed text-slate-500">
          Phản ánh này chưa hoàn tất quá trình xử lý. Bạn chỉ có thể đánh giá
          sau khi phản ánh đã được giải quyết
        </p>
      </div>
    );
  }

  if (hasRated) {
    return (
      <div className="flex max-h-[650px] min-h-[250px] w-full flex-col items-start justify-start rounded-xl border border-gray-200/90 bg-white px-3 py-4 shadow-xs md:px-8">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
            <h3 className="text-lg font-bold text-slate-800">
              Bạn đã gửi đánh giá
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
  }
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200/90 bg-white px-3 py-4 shadow-xs md:px-8">
      <div>
        <h3 className="text-xl font-bold text-slate-800">
          Đánh giá chất lượng hỗ trợ
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Phản hồi của bạn giúp chúng tôi cải thiện chất lượng phục vụ tốt hơn.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Rating Stars */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-slate-700">
            Bạn cảm thấy thế nào về cách giải quyết này?{" "}
            <span className="text-rose-500">*</span>
          </Label>
          <div className="flex flex-col items-center gap-2 md:flex-row">
            <div>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="group relative rounded-full p-1 transition-all hover:scale-110 focus:outline-none active:scale-95"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  <Star
                    className={`h-9 w-9 transition-colors ${
                      star <= (hoverRating || rating)
                        ? "fill-amber-400 text-amber-400 drop-shadow-sm"
                        : "fill-slate-100 text-slate-200 group-hover:fill-amber-200 group-hover:text-amber-200"
                    }`}
                  />
                </button>
              ))}
            </div>

            <div>
              <span className="ml-3 text-xs font-medium text-slate-500">
                {rating === 1 && "Rất không hài lòng"}
                {rating === 2 && "Không hài lòng"}
                {rating === 3 && "Bình thường"}
                {rating === 4 && "Hài lòng"}
                {rating === 5 && "Rất hài lòng"}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Select Messages */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-slate-700">
            Gợi ý nhận xét nhanh
          </Label>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_MESSAGES.map((msg) => (
              <button
                key={msg}
                type="button"
                onClick={() => handleSampleMessageClick(msg)}
                className="rounded-full border border-indigo-100 bg-indigo-50/50 px-3 py-1.5 text-xs font-medium text-indigo-700 transition-colors hover:bg-indigo-100 hover:text-indigo-800 active:bg-indigo-200"
              >
                + {msg}
              </button>
            ))}
          </div>
        </div>

        {/* Comment Textarea */}
        <div className="space-y-3">
          <Label
            htmlFor="comment"
            className="text-sm font-semibold text-slate-700"
          >
            Nhận xét thêm (Tuỳ chọn)
          </Label>
          <Textarea
            id="comment"
            placeholder="Chia sẻ trải nghiệm của bạn về quá trình hỗ trợ..."
            className="min-h-[120px] resize-none rounded-2xl bg-white shadow-sm focus-visible:ring-indigo-500"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={rating === 0 || isPending}
            className="rounded-full bg-indigo-600 px-8 font-semibold shadow-md transition-all hover:bg-indigo-700 hover:shadow-lg disabled:opacity-50"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Gửi đánh giá
          </Button>
        </div>
      </form>
    </div>
  );
};
