import React from "react";
import { AlertTriangle, XCircle, Info, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface WarningBoxProps {
  title?: string;
  message: string;
  variant?: "warning" | "error" | "info" | "success";
  className?: string;
}

const variantStyles = {
  warning: {
    container: "bg-amber-50 border-amber-200 shadow-amber-100/50",
    icon: <AlertTriangle className="h-5 w-5 text-amber-600" />,
    title: "text-amber-900",
    message: "text-amber-800",
  },
  error: {
    container: "bg-red-50 border-red-200 shadow-red-100/50",
    icon: <XCircle className="h-5 w-5 text-red-600" />,
    title: "text-red-900",
    message: "text-red-800",
  },
  info: {
    container: "bg-blue-50 border-blue-200 shadow-blue-100/50",
    icon: <Info className="h-5 w-5 text-blue-600" />,
    title: "text-blue-900",
    message: "text-blue-800",
  },
  success: {
    container: "bg-emerald-50 border-emerald-200 shadow-emerald-100/50",
    icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
    title: "text-emerald-900",
    message: "text-emerald-800",
  },
};

const WarningBox = ({
  title,
  message,
  variant = "warning",
  className,
}: WarningBoxProps) => {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        "flex w-full items-start gap-3 rounded-xl border p-4 shadow-sm transition-all duration-200",
        styles.container,
        className,
      )}
    >
      <div className="mt-0.5 shrink-0">{styles.icon}</div>
      <div className="flex flex-col gap-1">
        {title && (
          <h4 className={cn("text-sm leading-tight font-bold", styles.title)}>
            {title}
          </h4>
        )}
        <p className={cn("text-[13px] leading-relaxed", styles.message)}>
          {message}
        </p>
      </div>
    </div>
  );
};

export default WarningBox;
