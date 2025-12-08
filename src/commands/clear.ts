import { Eraser } from "lucide-react";
import { defineCommand } from "@/lib/commands";
import { cmd_clear_desc, cmd_clear_success } from "@/paraglide/messages.js";

export default defineCommand({
  name: "clear",
  description: cmd_clear_desc(),
  icon: Eraser,

  handler: (_args, context) => {
    context.clearMessages();
    return { success: true, message: cmd_clear_success() };
  },
});
