import { Eraser } from "lucide-react";
import {
  cmd_clear_desc,
  cmd_clear_success,
  cmd_clear_usage,
} from "@/paraglide/messages.js";
import type { Command } from "../types";

export const clearCommand: Command = {
  name: "clear",
  description: cmd_clear_desc(),
  icon: Eraser,
  aliases: ["cls", "c"],
  usage: cmd_clear_usage(),
  examples: ["/clear", "/cls"],

  handler: (_args, context) => {
    context.clearMessages();

    return {
      success: true,
      message: cmd_clear_success(),
    };
  },
};
