import { Navigation } from "lucide-react";
import {
  cmd_goto_desc,
  cmd_goto_missing_arg,
  cmd_goto_success,
  cmd_goto_unknown,
  cmd_goto_usage,
} from "@/paraglide/messages.js";
import type { Command } from "../types";

const ROUTES = {
  home: "/home",
  about: "/home",
  career: "/home",
  projects: "/home",
};

export const gotoCommand: Command = {
  name: "goto",
  description: cmd_goto_desc(),
  icon: Navigation,
  aliases: ["g", "nav"],
  usage: cmd_goto_usage(),
  examples: ["/goto home"],

  handler: (args, context) => {
    const availableRoutes = Object.keys(ROUTES).join(", ");

    if (args.length === 0) {
      return {
        success: false,
        message: cmd_goto_missing_arg({ routes: availableRoutes }),
      };
    }

    const route = args[0].toLowerCase();
    const path = ROUTES[route as keyof typeof ROUTES];

    if (!path) {
      return {
        success: false,
        message: cmd_goto_unknown({ route, routes: availableRoutes }),
      };
    }

    context.navigate(path);

    return {
      success: true,
      message: cmd_goto_success({ route }),
    };
  },
};
