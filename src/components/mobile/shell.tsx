import { Outlet, useLocation, useRouter } from "@tanstack/react-router";
import { useTransition } from "react";
import { PERSONAL_INFO } from "@/config/personal-info";
import { useGhostTyping } from "@/hooks/use-ghost-typing";
import { resolveRouteId } from "@/lib/routes";
import type { DockButton } from "@/types/mobile";
import CommandDock from "./command-dock";
import PromptHeader from "./prompt-header";

export default function Shell() {
  const router = useRouter();
  const location = useLocation();
  const [isPending, startTransition] = useTransition();
  const { text, isTyping, type, cancel } = useGhostTyping();

  const routeId = resolveRouteId(location.pathname);

  const handleButtonTap = (button: DockButton) => {
    if (isTyping) {
      cancel();
    }

    if (button.action === "back") {
      type(button.command);
      startTransition(() => {
        router.history.back();
      });
      return;
    }

    if (button.action === "resume") {
      type(button.command);
      window.open(PERSONAL_INFO.resume.url, "_blank");
      return;
    }

    if (button.action === "contact") {
      type(button.command);
      window.open(`mailto:${PERSONAL_INFO.contact.email}`);
      return;
    }

    if (button.action === "linkedin") {
      type(button.command);
      window.open(PERSONAL_INFO.contact.linkedin, "_blank");
      return;
    }

    if (button.action === "live") {
      return;
    }

    if (button.route) {
      const target = button.route;
      type(button.command);
      startTransition(() => {
        router.navigate({ to: target });
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
