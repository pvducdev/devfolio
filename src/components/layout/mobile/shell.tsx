import { Outlet, useLocation, useRouter } from "@tanstack/react-router";
import { lazy, Suspense, useState, useTransition } from "react";

import type { DockAction, DockButton } from "@/config/mobile-dock";
import { PERSONAL_INFO } from "@/config/personal-info";
import { getNextProjectId, getProjectById } from "@/config/projects";
import { resolveRouteId } from "@/lib/routes";

import CommandDock from "./command-dock";
import PromptHeader from "./prompt-header";
import SettingsDrawer from "./settings-drawer";
import { ShellNavigationContext } from "./shell-navigation";
import { useIsAssistantOpen, useMobileShellActions } from "./store";
import { useGhostTyping } from "./use-ghost-typing";

const MobileAssistantDrawer = lazy(
  () => import("@/components/assistant/mobile/drawer")
);

const PROJECT_DETAIL_PATTERN = /^\/m\/projects\/(?<id>.+)$/u;

const extractProjectId = (pathname: string): string | null =>
  pathname.match(PROJECT_DETAIL_PATTERN)?.groups?.id ?? null;

interface ActionContext {
  command: string;
  type: (command: string) => void;
  navigateWithCommand: (command: string, to: string) => void;
  goBack: () => void;
  pathname: string;
}

const openWithCommand = (
  { command, type }: ActionContext,
  url: string,
  target?: string
) => {
  type(command);
  window.open(url, target);
};

const actionHandlers: Record<DockAction, (ctx: ActionContext) => void> = {
  back: ({ command, type, goBack }) => {
    type(command);
    goBack();
  },
  contact: (ctx) =>
    openWithCommand(ctx, `mailto:${PERSONAL_INFO.contact.email}`),
  linkedin: (ctx) =>
    openWithCommand(ctx, PERSONAL_INFO.contact.linkedin, "_blank"),
  live: (ctx) => {
    const projectId = extractProjectId(ctx.pathname);
    const project = projectId ? getProjectById(projectId) : undefined;
    if (project) {
      openWithCommand(ctx, project.url, "_blank");
    }
  },
  next: ({ command, navigateWithCommand, pathname }) => {
    const projectId = extractProjectId(pathname);
    if (projectId) {
      navigateWithCommand(
        command,
        `/m/projects/${getNextProjectId(projectId)}`
      );
    }
  },
  resume: (ctx) => openWithCommand(ctx, PERSONAL_INFO.resume.url, "_blank"),
};

const Shell = () => {
  const router = useRouter();
  const location = useLocation();
  const [isPending, startTransition] = useTransition();
  const { text, isTyping, type } = useGhostTyping();
  const { toggleDrawer } = useMobileShellActions();
  const isAssistantOpen = useIsAssistantOpen();
  const [hasOpenedAssistant, setHasOpenedAssistant] = useState(false);

  if (isAssistantOpen && !hasOpenedAssistant) {
    setHasOpenedAssistant(true);
  }

  const routeId = resolveRouteId(location.pathname);

  const navigateWithCommand = (command: string, to: string) => {
    type(command);
    startTransition(() => {
      router.navigate({ to });
    });
  };

  const handleButtonTap = (button: DockButton) => {
    if ("route" in button) {
      navigateWithCommand(button.command, button.route);
      return;
    }

    actionHandlers[button.action]({
      command: button.command,
      goBack: () => startTransition(() => router.history.back()),
      navigateWithCommand,
      pathname: location.pathname,
      type,
    });
  };

  return (
    <div className="flex h-full flex-col font-mono">
      <PromptHeader isTyping={isTyping} typingText={text} />

      <main className="flex-1 overflow-y-auto px-4 pb-24">
        <ShellNavigationContext value={navigateWithCommand}>
          <Outlet />
        </ShellNavigationContext>
      </main>

      <CommandDock
        isTyping={isTyping || isPending}
        onButtonTap={handleButtonTap}
        onSettingsTap={toggleDrawer}
        routeId={routeId}
      />

      <SettingsDrawer />
      {hasOpenedAssistant && (
        <Suspense fallback={null}>
          <MobileAssistantDrawer />
        </Suspense>
      )}
    </div>
  );
};

export default Shell;
