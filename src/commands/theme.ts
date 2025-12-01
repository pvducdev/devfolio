import { Palette } from "lucide-react";
import { THEMES } from "@/config/theme";
import { defineCommand } from "@/lib/commands";

export default defineCommand({
  name: "theme",
  description: "Change the application theme",
  icon: Palette,
  aliases: ["t"],

  handler: (args, context) => {
    const themeName = args[0];
    const validThemes = THEMES.map((t) => t.value);

    if (!themeName) {
      return {
        success: false,
        message: `Usage: /theme <name>\nAvailable: ${validThemes.join(", ")}`,
      };
    }

    if (!validThemes.includes(themeName)) {
      return {
        success: false,
        message: `Invalid theme "${themeName}". Available: ${validThemes.join(", ")}`,
      };
    }

    context.setTheme(themeName);
    return { success: true, message: `Theme changed to "${themeName}"` };
  },
});
