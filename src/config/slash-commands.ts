import type { LucideIcon } from "lucide-react";
import { Eraser } from "lucide-react";

export type SlashCommand = {
  name: string;
  description: string;
  icon?: LucideIcon;
};

export const SLASH_COMMANDS: SlashCommand[] = [
  {
    name: "clear",
    description: "Clear all messages and reset the conversation",
    icon: Eraser,
  },
  {
    name: "zxc",
    description: "zxc123",
    icon: Eraser,
  },
];

export const SLASH_PREFIX = "/";
