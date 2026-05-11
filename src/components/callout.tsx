import {
  AlertCircle,
  AlertTriangle,
  Information,
  Lightbulb,
  ScrollText,
  Sparkle,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ReactNode } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface CalloutProps {
  children: ReactNode;
  title?: string;
  variant?: "note" | "info" | "warning" | "tip" | "danger" | "ai";
  [key: string]: unknown;
}

const icons: Record<NonNullable<CalloutProps["variant"]>, typeof ScrollText> = {
  note: ScrollText,
  info: Information,
  tip: Lightbulb,
  warning: AlertCircle,
  danger: AlertTriangle,
  ai: Sparkle,
};

export const Callout = ({ variant, title, children }: CalloutProps) => {
  const Icon = icons[variant ?? "note"];

  return (
    <Card className="font-mono" data-variant={variant ?? "note"}>
      <CardHeader>
        <CardAction className="pointer-events-none">
          <HugeiconsIcon
            aria-hidden="true"
            className="callout-icon"
            icon={Icon}
            size={18}
          />
        </CardAction>
        {title && <CardTitle>{title}</CardTitle>}
      </CardHeader>
      {children && <CardContent>{children}</CardContent>}
    </Card>
  );
};
