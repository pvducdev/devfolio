import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { NotFoundIllustration } from "./not-found-illustration";

interface ErrorPageProps {
  code?: string;
  showCode?: boolean;
  title?: string;
  description?: string;
  illustration?: ReactNode;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

const CODE_ILLUSTRATIONS: Record<string, ReactNode> = {
  "404": <NotFoundIllustration className="h-64 w-auto" />,
};

export default function ErrorPage({
  code,
  showCode = !!code,
  title,
  description,
  illustration,
  actionLabel,
  actionHref = "/home",
  onAction,
}: ErrorPageProps) {
  const resolvedIllustration =
    illustration ?? (code ? CODE_ILLUSTRATIONS[code] : null);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4">
      {resolvedIllustration}

      <div className="text-center">
        {showCode && (
          <p className="font-bold font-mono text-6xl tracking-tight">{code}</p>
        )}
        {title && <h1 className="mt-2 font-medium text-xl">{title}</h1>}
        {description && (
          <p className="mt-1 text-muted-foreground text-sm">{description}</p>
        )}
      </div>

      {onAction ? (
        <Button onClick={onAction} variant="outline">
          {actionLabel}
        </Button>
      ) : (
        <Button asChild variant="outline">
          <Link to={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
}
