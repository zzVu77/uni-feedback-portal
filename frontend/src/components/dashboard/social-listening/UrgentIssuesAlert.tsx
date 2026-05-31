import React from "react";
import { FeedbackPost } from "@/types/social-listening";
import { AlertTriangle, ExternalLink, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

interface UrgentIssuesAlertProps {
  issues: FeedbackPost[];
}

const UrgentIssuesAlert: React.FC<UrgentIssuesAlertProps> = ({ issues }) => {
  if (!issues || issues.length === 0) return null;

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-rose-200 bg-white shadow-md ring-1 ring-rose-500/10">
      <div className="flex items-center gap-3 border-b border-rose-100 bg-rose-50/50 p-5 sm:p-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600 shadow-sm ring-1 ring-rose-200">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
            Vấn đề nghiêm trọng cần chú ý
          </h3>
          <p className="mt-0.5 text-sm font-medium text-slate-500">
            Phát hiện {issues.length} bài đăng có mức độ tiêu cực cao hoặc mang
            tính chất nghiêm trọng
          </p>
        </div>
      </div>

      <ScrollArea className="h-[500px] w-full rounded-b-2xl">
        <div className="flex flex-col">
          {issues.map((issue, index) => (
            <div
              key={issue.postId}
              className={`flex flex-col justify-between gap-4 p-5 transition-colors hover:bg-slate-50 sm:flex-row sm:items-start sm:p-6 ${
                index !== issues.length - 1 ? "border-b border-slate-100" : ""
              }`}
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
                    <AlertTriangle className="h-3 w-3" />
                    {issue.sentimentLabel}
                  </span>
                  <span className="border-l border-slate-300 pl-2 text-xs font-medium text-slate-500">
                    {format(new Date(issue.postedAt), "dd/MM/yyyy HH:mm")}
                  </span>
                  <span className="border-l border-slate-300 pl-2 text-xs font-medium text-slate-500">
                    {issue.author}
                  </span>
                </div>
                <p className="text-sm leading-snug font-semibold text-slate-800">
                  {issue.aiSummary || "Không có tóm tắt AI"}
                </p>
                <p className="line-clamp-2 text-sm text-slate-500">
                  {issue.content}
                </p>
              </div>

              <div className="shrink-0 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (issue.postLink) window.open(issue.postLink, "_blank");
                  }}
                  className="w-full border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 sm:w-auto"
                >
                  Xem chi tiết <ExternalLink className="ml-2 h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default UrgentIssuesAlert;
