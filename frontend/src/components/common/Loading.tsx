import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type LoadingSize = "sm" | "md" | "lg" | "xl";
type LoadingVariant = "spinner" | "dots" | "pulse" | "fullscreen";

interface LoadingProps {
  variant?: LoadingVariant;
  size?: LoadingSize;
  message?: string;
  className?: string;
}

const sizeClasses: Record<LoadingSize, string> = {
  sm: "w-4 h-4",
  md: "w-8 h-8",
  lg: "w-12 h-12",
  xl: "w-16 h-16",
};

const textSizeClasses: Record<LoadingSize, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
  xl: "text-lg",
};

const SpinnerVariant = ({
  size,
  className,
}: {
  size: LoadingSize;
  className?: string;
}) => (
  <Loader2
    className={cn("animate-spin text-blue-500", sizeClasses[size], className)}
  />
);

const DotsVariant = ({
  size,
  className,
}: {
  size: LoadingSize;
  className?: string;
}) => {
  // Dynamic sizing for dots based on the 'size' prop
  const dotSize =
    size === "sm"
      ? "w-1 h-1"
      : size === "md"
        ? "w-2.5 h-2.5"
        : size === "lg"
          ? "w-4 h-4"
          : "w-5 h-5";

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      <div
        className={cn(
          "bg-primary animate-bounce rounded-full [animation-delay:-0.3s]",
          dotSize,
        )}
      />
      <div
        className={cn(
          "bg-primary animate-bounce rounded-full [animation-delay:-0.15s]",
          dotSize,
        )}
      />
      <div className={cn("bg-primary animate-bounce rounded-full", dotSize)} />
    </div>
  );
};

const PulseVariant = ({
  size,
  className,
}: {
  size: LoadingSize;
  className?: string;
}) => (
  <div
    className={cn(
      "relative flex items-center justify-center",
      sizeClasses[size],
      className,
    )}
  >
    <span className="bg-primary/75 absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
    <span className="bg-primary relative inline-flex h-3/4 w-3/4 rounded-full"></span>
  </div>
);

// --- Main Component ---

export const Loading: React.FC<LoadingProps> = ({
  variant = "spinner",
  size = "md",
  message = "Đang tải dữ liệu...",
  className,
}) => {
  // If variant is fullscreen, we enforce a fixed overlay layout
  if (variant === "fullscreen") {
    return (
      <div className="bg-background/80 animate-in fade-in zoom-in fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-sm duration-300">
        <SpinnerVariant size="lg" />
        {message && (
          <p
            className={cn(
              "mt-4 animate-pulse font-medium text-blue-600/70",
              textSizeClasses["lg"],
            )}
          >
            {message}
          </p>
        )}
      </div>
    );
  }

  // Render specific variants
  const renderLoader = () => {
    switch (variant) {
      case "dots":
        return <DotsVariant size={size} />;
      case "pulse":
        return <PulseVariant size={size} />;
      default:
        return <SpinnerVariant size={size} />;
    }
  };

  return (
    <div
      role="status"
      className={cn(
        "flex h-full flex-col items-center justify-center gap-3",
        className,
      )}
    >
      {renderLoader()}
      {message && (
        <p
          className={cn(
            "animate-pulse font-medium text-blue-500/70",
            textSizeClasses[size],
          )}
        >
          {message}
        </p>
      )}
      <span className="sr-only">Loading...</span>
    </div>
  );
};
