import { HelpCircle } from "lucide-react";
import {
  cmd_help_desc,
  cmd_help_detail_aliases,
  cmd_help_detail_examples,
  cmd_help_detail_usage,
  cmd_help_list_footer,
  cmd_help_list_title,
  cmd_help_unknown,
  cmd_help_usage,
} from "@/paraglide/messages.js";
import { listCommands } from "../registry";
import type { Command } from "../types";

export const helpCommand: Command = {
  name: "help",
  description: cmd_help_desc(),
  icon: HelpCircle,
  aliases: ["?", "h"],
  usage: cmd_help_usage(),
  examples: ["/help", "/help theme", "/?"],

  handler: (args, _context) => {
    const commands = listCommands();

    if (args.length > 0) {
      const cmdName = args[0];
      const cmd = commands.find((c) => c.name === cmdName);

      if (!cmd) {
        return {
          success: false,
          message: cmd_help_unknown({ cmdName }),
        };
      }

      return {
        success: true,
        message: formatCommandHelp(cmd),
      };
    }

    return {
      success: true,
      message: formatCommandList(commands),
    };
  },
};

function formatCommandHelp(cmd: Command): string {
  const parts = [`**/${cmd.name}** - ${cmd.description}`];

  if (cmd.usage) {
    parts.push(`**${cmd_help_detail_usage()}** ${cmd.usage}`);
  }

  if (cmd.aliases?.length) {
    parts.push(
      `**${cmd_help_detail_aliases()}** ${cmd.aliases.map((a) => `/${a}`).join(", ")}`
    );
  }

  if (cmd.examples?.length) {
    parts.push(
      `**${cmd_help_detail_examples()}**\n${cmd.examples.map((e) => `  ${e}`).join("\n")}`
    );
  }

  return parts.join("\n\n");
}

function formatCommandList(commands: Command[]): string {
  return `**${cmd_help_list_title()}**

${commands.map((cmd) => `**/${cmd.name}** - ${cmd.description}`).join("\n")}

${cmd_help_list_footer()}`;
}
