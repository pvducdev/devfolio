import { CircleHelp } from "lucide-react";
import { defineCommand, listCommands } from "@/lib/commands";

export default defineCommand({
  name: "help",
  description: "Show available commands",
  icon: CircleHelp,
  aliases: ["h", "?"],

  handler: () => {
    const commands = listCommands();

    const helpText = `# Available Commands

Type a command starting with \`/\` to execute it.

${commands
  .map((cmd) => {
    const examples = getCommandExamples(cmd.name);
    const aliasText =
      cmd.aliases?.length ? ` (aliases: ${cmd.aliases.map((a) => `/${a}`).join(", ")})` : "";
    return `### \`/${cmd.name}\`${aliasText}

${cmd.description}

${examples ? `**Usage:**\n${examples}` : ""}`;
  })
  .join("\n\n")}

---

**Tip:** Press \`Tab\` to autocomplete commands while typing.`;

    return { success: true, message: helpText };
  },
});

function getCommandExamples(commandName: string): string {
  const examples: Record<string, string> = {
    clear: "`/clear` - Clears the conversation",
    help: "`/help` - Shows this help message",
    theme:
      "`/theme <name>` - Changes the theme\n\nExamples:\n- `/theme amethyst-haze`\n- `/theme bubblegum`\n- `/theme dark-twitter`\n- `/theme mocha-mousse`",
  };

  return examples[commandName] || "";
}
