import { Palette } from "lucide-react";
import { THEMES } from "@/config/theme";
import {
  cmd_theme_desc,
  cmd_theme_missing_arg,
  cmd_theme_success,
  cmd_theme_unknown,
  cmd_theme_usage,
} from "@/paraglide/messages.js";
import type { Command } from "../types";

export const setThemeCommand: Command = {
  name: "theme",
  description: cmd_theme_desc(),
  icon: Palette,
  aliases: ["t"],
  usage: cmd_theme_usage(),
  examples: ["/theme dark", "/theme notebook", "/t bubblegum"],

  handler: (args, context) => {
    const availableThemes = THEMES.map((t) => t.value).join(", ");

    if (args.length === 0) {
      return {
        success: false,
        message: cmd_theme_missing_arg({ themes: availableThemes }),
      };
    }

    const themeName = args[0].toLowerCase();
    const theme = THEMES.find((t) => t.value === themeName);

    if (!theme) {
      return {
        success: false,
        message: cmd_theme_unknown({ themeName, themes: availableThemes }),
      };
    }

    context.setTheme(theme.value);

    return {
      success: true,
      message: cmd_theme_success({ themeName: theme.name }),
    };
  },
};
