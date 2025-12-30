import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface ErrorPageProps {
  code?: string;
  title?: string;
  description?: string;
  illustration?: ReactNode;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

export default function ErrorPage({
  code,
  title,
  description,
  illustration,
  actionLabel,
  actionHref,
  onAction,
}: ErrorPageProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4">
      {illustration}

      <div className="text-center">
        {code && (
          <p className="font-bold font-mono text-6xl tracking-tight">{code}</p>
        )}
        {title && <h1 className="mt-2 font-medium text-xl">{title}</h1>}
        {description && (
          <p className="mt-1 text-muted-foreground text-sm">{description}</p>
        )}
      </div>

      {actionHref ? (
        <Button asChild variant="outline">
          <Link to={actionHref}>{actionLabel}</Link>
        </Button>
      ) : (
        <Button onClick={onAction} variant="outline">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
