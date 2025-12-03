import type { CardStyle } from "@/config/career-timeline";

export type CardStyleConfig = {
  container: string;
  header: string;
  title: string;
  subtitle: string;
  detailPrefix: string;
  detailText: string;
  wrapper: string;
  titleBar?: boolean;
  lineNumbers?: boolean;
};

export const CARD_STYLE_REGISTRY: Record<CardStyle, CardStyleConfig> = {
  blackboard: {
    container: "bg-foreground text-background border-2 border-background/20",
    header: "border-background/30",
    title: "text-background",
    subtitle: "text-background/70",
    detailPrefix: "text-background/50",
    detailText: "text-background/90",
    wrapper: "",
  },
  postit: {
    container:
      "bg-yellow-100 text-yellow-900 border-yellow-300 shadow-lg dark:bg-yellow-200",
    header: "border-yellow-400/50",
    title: "text-yellow-900",
    subtitle: "text-yellow-700",
    detailPrefix: "text-yellow-600",
    detailText: "text-yellow-800",
    wrapper: "rotate-1",
  },
  window: {
    container: "bg-background border-foreground/50 rounded-lg overflow-hidden",
    header: "border-foreground/20",
    title: "text-foreground",
    subtitle: "text-foreground/60",
    detailPrefix: "text-foreground/40",
    detailText: "text-foreground",
    wrapper: "",
    titleBar: true,
  },
  code: {
    container:
      "bg-zinc-900 text-green-400 border-green-500/30 dark:bg-zinc-950",
    header: "border-green-500/20",
    title: "text-green-300",
    subtitle: "text-green-500/70",
    detailPrefix: "text-green-600",
    detailText: "text-green-400",
    wrapper: "",
    lineNumbers: true,
  },
};

export const DEFAULT_CARD_STYLE: CardStyleConfig = {
  container: "bg-background border-foreground",
  header: "border-foreground/30",
  title: "text-foreground",
  subtitle: "text-foreground/60",
  detailPrefix: "text-foreground/40",
  detailText: "text-foreground",
  wrapper: "",
};

export function getCardStyle(style: CardStyle): CardStyleConfig {
  return CARD_STYLE_REGISTRY[style] ?? DEFAULT_CARD_STYLE;
}
