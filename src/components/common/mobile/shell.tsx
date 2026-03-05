import { Outlet, useLocation, useRouter } from "@tanstack/react-router";
import { useEffect, useTransition } from "react";
import { PERSONAL_INFO } from "@/config/personal-info.ts";
import { getNextProjectId, getProjectById } from "@/config/projects.ts";
import { useGhostTyping } from "@/hooks/use-ghost-typing.ts";
import { resolveRouteId } from "@/lib/routes.ts";
import {
  useMobileShellStore,
  usePendingNavigation,
} from "@/store/mobile-shell.ts";
import type { DockButton } from "@/types/mobile.ts";
import CommandDock from "./command-dock.tsx";
import PromptHeader from "./prompt-header.tsx";

const PROJECT_DETAIL_PATTERN = /^\/m\/projects\/(.+)$/;

function extractProjectId(pathname: string): string | null {
  const match = pathname.match(PROJECT_DETAIL_PATTERN);
  return match ? match[1] : null;
}

type ActionHandler = (
  button: DockButton,
  ctx: {
    type: (command: string) => void;
    cancel: () => void;
    isTyping: boolean;
    startTransition: (cb: () => void) => void;
    router: ReturnType<typeof useRouter>;
    pathname: string;
  }
) => void;

const actionHandlers: Record<string, ActionHandler> = {
  back: (button, { type, startTransition, router }) => {
    type(button.command);
    startTransition(() => {
      router.history.back();
    });
  },
  resume: (button, { type }) => {
    type(button.command);
    window.open(PERSONAL_INFO.resume.url, "_blank");
  },
  contact: (button, { type }) => {
    type(button.command);
    window.open(`mailto:${PERSONAL_INFO.contact.email}`);
  },
  linkedin: (button, { type }) => {
    type(button.command);
    window.open(PERSONAL_INFO.contact.linkedin, "_blank");
  },
  live: (button, { type, pathname }) => {
    const projectId = extractProjectId(pathname);
    if (!projectId) {
      return;
    }
    const project = getProjectById(projectId);
    if (!project.url) {
      return;
    }
    type(button.command);
    window.open(project.url, "_blank");
  },
  next: (button, { type, startTransition, router, pathname }) => {
    const projectId = extractProjectId(pathname);
    if (!projectId) {
      return;
    }
    const nextId = getNextProjectId(projectId);
    type(button.command);
    startTransition(() => {
      router.navigate({ to: `/m/projects/${nextId}` });
    });
  },
};

export default function Shell() {
  const router = useRouter();
  const location = useLocation();
  const [isPending, startTransition] = useTransition();
  const { text, isTyping, type, cancel } = useGhostTyping();
  const pendingNavigation = usePendingNavigation();

  const routeId = resolveRouteId(location.pathname);

  useEffect(() => {
    if (!pendingNavigation) {
      return;
    }

    const { command, to } = pendingNavigation;
    useMobileShellStore.getState().clearNavigation();

    if (isTyping) {
      cancel();
    }

    type(command);
    startTransition(() => {
      router.navigate({ to });
    });
  }, [pendingNavigation, cancel, isTyping, type, router]);

  const handleButtonTap = (button: DockButton) => {
    if (isTyping) {
      cancel();
    }

    if (button.action) {
      const handler = actionHandlers[button.action];
      if (handler) {
        handler(button, {
          type,
          cancel,
          isTyping,
          startTransition,
          router,
          pathname: location.pathname,
        });
      }
      return;
    }

    if (button.route) {
      type(button.command);
      startTransition(() => {
        router.navigate({ to: button.route });
      });
    }
  };

  return (
    <div className="flex h-full flex-col font-mono">
      <PromptHeader isTyping={isTyping} typingText={text} />

      <main className="flex-1 overflow-y-auto px-4 pb-24">
        <Outlet />
      </main>

      <CommandDock
        isTyping={isTyping || isPending}
        onButtonTap={handleButtonTap}
        routeId={routeId}
      />
    </div>
  );
}
