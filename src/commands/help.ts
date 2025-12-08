import { CircleHelp } from "lucide-react";
import { defineCommand, listCommands } from "@/lib/commands";
import {
  cmd_help_clear,
  cmd_help_desc,
  cmd_help_help,
  cmd_help_intro,
  cmd_help_theme,
  cmd_help_tip,
  cmd_help_title,
} from "@/paraglide/messages.js";

export default defineCommand({
  name: "help",
  description: cmd_help_desc(),
  icon: CircleHelp,
  aliases: ["h", "?"],

  handler: () => {
    const commands = listCommands();

    const helpText = `# ${cmd_help_title()}

${cmd_help_intro()}

${commands
  .map((cmd) => {
    const examples = getCommandExamples(cmd.name);
    const aliasText = cmd.aliases?.length
      ? ` (aliases: ${cmd.aliases.map((a) => `/${a}`).join(", ")})`
      : "";
    return `### \`/${cmd.name}\`${aliasText}

${cmd.description}

${examples ? `**Usage:**\n${examples}` : ""}`;
  })
  .join("\n\n")}

---

**${cmd_help_tip()}**`;

    return { success: true, message: helpText };
  },
});

function getCommandExamples(commandName: string): string {
  const examples: Record<string, string> = {
    clear: `\`/clear\` - ${cmd_help_clear()}`,
    help: `\`/help\` - ${cmd_help_help()}`,
    theme: `\`/theme <name>\` - ${cmd_help_theme()}\n\nExamples:\n- \`/theme amethyst-haze\`\n- \`/theme bubblegum\`\n- \`/theme dark-twitter\`\n- \`/theme mocha-mousse\``,
  };

  return examples[commandName] || "";
}
