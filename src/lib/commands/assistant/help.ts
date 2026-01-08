import { HelpCircle } from "lucide-react";
import {
  cmd_help_desc,
  cmd_help_list_footer,
  cmd_help_list_title,
  cmd_help_pro_tip,
} from "@/paraglide/messages.js";
import { listCommands } from "../registry";
import type { Command } from "../types";

export const helpCommand: Command = {
  name: "help",
  description: cmd_help_desc(),
  icon: HelpCircle,
  aliases: ["?", "h"],
  examples: ["/help", "/?"],

  handler: () => {
    const commands = listCommands();

    return {
      success: true,
      message: `**${cmd_help_list_title()}**

${commands.map((cmd) => `- **/${cmd.name}** - ${cmd.description}`).join("\n")}

${cmd_help_list_footer()}

${cmd_help_pro_tip()}`,
    };
  },
};
