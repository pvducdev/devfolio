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
    <div className="flex min-h-svh flex-col items-center justify-center px-4 py-8 sm:px-6 md:py-12">
      <div className="w-full max-w-md space-y-6 sm:space-y-8">
        {illustration && (
          <div className="flex justify-center [&>svg]:h-40 [&>svg]:w-auto sm:[&>svg]:h-52 md:[&>svg]:h-64">
            {illustration}
          </div>
        )}

        <div className="space-y-2 text-center sm:space-y-3">
          {code && (
            <p className="font-bold font-mono text-5xl tracking-tighter sm:text-6xl md:text-7xl">
              {code}
            </p>
          )}
          {title && <h1 className="font-medium text-lg sm:text-xl">{title}</h1>}
          {description && (
            <p className="mx-auto max-w-xs text-muted-foreground text-sm sm:max-w-sm sm:text-base">
              {description}
            </p>
          )}
        </div>

        <div className="flex justify-center pt-2">
          {actionHref ? (
            <Button asChild size="default" variant="outline">
              <Link to={actionHref}>{actionLabel}</Link>
            </Button>
          ) : (
            <Button onClick={onAction} size="default" variant="outline">
              {actionLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
