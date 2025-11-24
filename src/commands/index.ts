import { registry } from "@/lib/commands";
import clearCommand from "./clear";
import helpCommand from "./help";
import themeCommand from "./theme";

registry.register(clearCommand);
registry.register(helpCommand);
registry.register(themeCommand);
