import type { CSSProperties } from "react";

const GRID_SIZES = {
  small: 16,
  medium: 20,
  large: 24,
  xlarge: 30,
} as const;

type GridSize = keyof typeof GRID_SIZES;

type CodeGridAccentProps = {
  opacity?: number;
  variant?: "neutral" | "gradient-matched" | "high-contrast";
  gridSize?: GridSize;
};

const COLOR_VARIANTS = {
  neutral: {
    gridOpacity: "opacity-20",
    icons: "text-gray-600",
    iconOpacity: "opacity-15",
  },
  "gradient-matched": {
    gridOpacity: "opacity-18",
    icons: "text-current",
    iconOpacity: "opacity-12",
  },
  "high-contrast": {
    gridOpacity: "opacity-12",
    icons: "text-gray-400",
    iconOpacity: "opacity-10",
  },
} as const;

export const CodeGridAccent = ({
  opacity = 1,
  variant = "neutral",
  gridSize = "medium",
}: CodeGridAccentProps) => {
  const colors = COLOR_VARIANTS[variant];
  const gridSizePx = GRID_SIZES[gridSize];

  const gridStyle: CSSProperties = {
    backgroundImage:
      "radial-gradient(circle, currentColor 1px, transparent 1px)",
    backgroundSize: `${gridSizePx}px ${gridSizePx}px`,
    color: variant === "neutral" ? "#999999" : "inherit",
  };

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ opacity }}
    >
      <div
        className={`absolute inset-0 ${colors.gridOpacity}`}
        style={gridStyle}
      />

      <div
        className={`absolute inset-0 ${colors.icons} ${colors.iconOpacity} select-none font-mono`}
      >
        <span className="absolute top-[80px] left-[100px] text-sm">
          {"{ }"}
        </span>
        <span className="absolute top-[120px] right-[100px] text-sm">
          {"<\u00A0/>"}
        </span>

        <span className="absolute top-[380px] left-[80px] text-sm">
          {"[\u00A0]"}
        </span>
        <span className="absolute top-[420px] right-[60px] hidden text-sm sm:inline">
          {"{ }"}
        </span>

        <span className="absolute top-[520px] left-[120px] text-sm">
          {"(\u00A0)"}
        </span>
        <span className="absolute top-[580px] right-[140px] hidden text-sm md:inline">
          {"<\u00A0/>"}
        </span>

        <span className="-translate-x-1/2 absolute top-[640px] left-1/2 hidden text-base sm:inline">
          {"──"}
        </span>

        <span className="absolute bottom-[180px] left-[140px] hidden text-sm md:inline">
          {"[\u00A0]"}
        </span>
        <span className="absolute right-[120px] bottom-[160px] text-sm">
          {"(\u00A0)"}
        </span>
      </div>
    </div>
  );
};
