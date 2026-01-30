import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  FileQuestion,
  SearchX,
  AlertCircle,
  FolderOpen,
  RefreshCcw,
  ArrowLeft,
} from "lucide-react";
import { Button } from "../ui/button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  retryAction?: () => void;
  retryLabel?: string;
  backLink?: string;
  backLabel?: string;
  errorCode?: string | number;
  className?: string;
  isFullScreen?: boolean; // Kept for compatibility, but mapped to new design
  icon?: React.ElementType; // Allow custom icon
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = "Không tìm thấy dữ liệu",
  description = "Rất tiếc, chúng tôi không tìm thấy dữ liệu bạn yêu cầu.",
  retryAction,
  retryLabel = "Thử lại",
  backLink,
  backLabel = "Quay lại",
  errorCode,
  className,
  isFullScreen = false,
  icon: CustomIcon,
}) => {
  // Select icon based on error code or defaults
  const getIcon = () => {
    if (CustomIcon) return CustomIcon;
    if (errorCode === "FETCH_ERROR" || errorCode === 500) return AlertCircle;
    if (errorCode === 404) return FileQuestion;
    if (title?.toLowerCase().includes("kết quả")) return SearchX;
    return FolderOpen;
  };

  const Icon = getIcon();

  const Container = isFullScreen ? "main" : "div";
  const containerClasses = isFullScreen
    ? "flex min-h-[60vh] w-full flex-col items-center justify-center bg-slate-50/50 p-6"
    : cn("flex flex-col items-center justify-center py-12 px-4", className);

  return (
    <Container className={containerClasses}>
      {/* Icon Circle */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-gray-200">
        <Icon className="h-10 w-10 text-red-400" strokeWidth={1.5} />
      </div>

      {/* Text Content */}
      <div className="flex max-w-md flex-col items-center gap-4 text-center">
        <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
        <p className="text-sm leading-relaxed text-slate-500">
          {description}
          {/* {errorCode && (
            <span className="mt-2 block font-mono text-xs text-slate-400">
              Code: {errorCode}
            </span>
          )} */}
        </p>

        {/* Actions */}
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          {retryAction && (
            <Button
              onClick={retryAction}
              className="group inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
            >
              <RefreshCcw className="h-4 w-4 transition-transform group-hover:rotate-180" />
              {retryLabel}
            </Button>
          )}

          {backLink && (
            <Link
              href={backLink}
              className="group inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:outline-none"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              {backLabel}
            </Link>
          )}
        </div>
      </div>
    </Container>
  );
};

export default EmptyState;
