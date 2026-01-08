import { MessageSquare } from "lucide-react";
import { getLogger } from "@/lib/logger/client";
import {
  cmd_feedback_desc,
  cmd_feedback_empty,
  cmd_feedback_failed,
  cmd_feedback_success,
  cmd_feedback_usage,
} from "@/paraglide/messages.js";
import type { Command } from "../types";

export const sendFeedbackCommand: Command = {
  name: "feedback",
  description: cmd_feedback_desc(),
  icon: MessageSquare,
  aliases: ["fb"],
  usage: cmd_feedback_usage(),
  examples: ["/feedback Great portfolio!", "/fb Found a bug on projects page"],

  handler: async (args) => {
    const message = args.join(" ").trim();

    if (!message) {
      return {
        success: false,
        message: cmd_feedback_empty(),
      };
    }

    try {
      const logger = getLogger();
      await logger.info(`[User Feedback]: ${message}`);
      await logger.flush();

      return {
        success: true,
        message: cmd_feedback_success(),
      };
    } catch {
      return {
        success: false,
        message: cmd_feedback_failed(),
      };
    }
  },
};
