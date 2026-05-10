import type { FC } from "react";

export const Divider: FC = () => (
  <span
    className="block h-6 w-full border-neutral-800 border-y"
    style={{
      backgroundImage:
        "repeating-linear-gradient(-45deg, transparent, transparent 8px, rgb(38, 38, 38) 8px, rgb(38, 38, 38) 9px)",
    }}
  />
);
