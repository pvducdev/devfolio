import { Palette } from "lucide-react";
import { THEMES } from "@/config/theme";
import type { Command } from "@/lib/commands/types";

const themeCommand: Command = {
  name: "theme",
  description: "Change the application theme",
  icon: Palette,

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

    return {
      success: true,
      message: `Theme changed to "${themeName}"`,
    };
  },
};

export default themeCommand;
