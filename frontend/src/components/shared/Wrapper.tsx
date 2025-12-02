import { cn } from "@/lib/utils";
import React from "react";

interface WrapperProps {
  children: React.ReactNode;
  classNames?: {
    title?: HTMLHeadingElement["className"];
    desc?: HTMLParagraphElement["className"];
    container?: HTMLDivElement["className"];
  };
  title?: string;
  description?: string;
}

const Wrapper: React.FC<WrapperProps> = ({
  children,
  classNames,
  title,
  description,
}) => {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center gap-4 px-2 lg:px-8",
        classNames?.container,
      )}
    >
      {title && (
        <div className="flex max-w-[600px] flex-col items-center justify-center gap-2">
          {title && (
            <h2
              className={cn(
                "text-center text-[33px] font-[900] text-white uppercase",
                classNames?.title,
              )}
            >
              {title}
            </h2>
          )}
          {description && (
            <p
              className={cn(
                "text-center text-[16px] font-[200] text-white",
                classNames?.desc,
              )}
            >
              {description}
            </p>
          )}
        </div>
      )}

      {children}
    </div>
  );
};

export default Wrapper;
