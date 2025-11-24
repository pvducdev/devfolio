import { CircleHelp } from "lucide-react";
import { registry } from "@/lib/commands";
import type { Command } from "@/lib/commands/types";

const helpCommand: Command = {
  name: "help",
  description: "Show available commands",
  icon: CircleHelp,

  handler: (_args, _context) => {
    const commands = registry.list();

    const helpText = `# Available Commands

Type a command starting with \`/\` to execute it.

${commands
  .map((cmd) => {
    const examples = getCommandExamples(cmd.name);
    return `### \`/${cmd.name}\`

${cmd.description}

${examples ? `**Usage:**\n${examples}` : ""}`;
  })
  .join("\n\n")}

---

**Tip:** Press \`Tab\` to autocomplete commands while typing.`;

    return {
      success: true,
      message: helpText,
    };
  },
};

function getCommandExamples(commandName: string): string {
  const examples: Record<string, string> = {
    clear: "`/clear` - Clears the conversation",
    help: "`/help` - Shows this help message",
    theme:
      "`/theme <name>` - Changes the theme\n\nExamples:\n- `/theme amethyst-haze`\n- `/theme bubblegum`\n- `/theme dark-twitter`\n- `/theme mocha-mousse`",
  };

  return examples[commandName] || "";
}

export default helpCommand;
