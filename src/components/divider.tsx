import type { FC, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Divider: FC<HTMLAttributes<HTMLSpanElement>> = (props) => (
  <span
    {...props}
    className={cn(
      "block h-6 w-full border-neutral-800 border-y",
      props.className
    )}
    style={{
      backgroundImage:
        "repeating-linear-gradient(-45deg, transparent, transparent 8px, rgb(38, 38, 38) 8px, rgb(38, 38, 38) 9px)",
    }}
  />
);
