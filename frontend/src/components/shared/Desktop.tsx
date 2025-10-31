import { cn } from "@/lib/utils";

type Props = React.ComponentProps<"div">;

const Show: React.FC<Props> = ({ children, className, ...props }: Props) => {
  return (
    <div className={cn("hidden lg:block", className)} {...props}>
      {children}
    </div>
  );
};

const Hide: React.FC<Props> = ({ children, className, ...props }: Props) => {
  return (
    <div className={cn("lg:hidden", className)} {...props}>
      {children}
    </div>
  );
};

export default {
  Show,
  Hide,
} as const;
