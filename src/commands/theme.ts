import { Palette } from "lucide-react";
import { THEMES } from "@/config/theme";
import { defineCommand } from "@/lib/commands";
import {
  cmd_theme_desc,
  cmd_theme_invalid,
  cmd_theme_success,
  cmd_theme_usage,
} from "@/paraglide/messages.js";

export default defineCommand({
  name: "theme",
  description: cmd_theme_desc(),
  icon: Palette,
  aliases: ["t"],

  handler: (args, context) => {
    const themeName = args[0];
    const validThemes = THEMES.map((t) => t.value);
    const themesStr = validThemes.join(", ");

    if (!themeName) {
      return {
        success: false,
        message: `${cmd_theme_usage()}\nAvailable: ${themesStr}`,
      };
    }

    if (!validThemes.includes(themeName)) {
      return {
        success: false,
        message: cmd_theme_invalid({ themeName, themes: themesStr }),
      };
    }

    context.setTheme(themeName);
    return { success: true, message: cmd_theme_success({ themeName }) };
  },
});
