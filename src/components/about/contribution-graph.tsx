import { mergeProps } from "@base-ui/react/merge-props";
import { cn } from "cn";
import { createContext, use, useState } from "react";
import type { ComponentProps } from "react";

import type { ContributionData } from "@/lib/contributions";

import { getLevelForCount } from "./contribution-levels";
import { toISODateString } from "./format";

interface GraphContextValue {
  counts: Map<string, number>;
  selectedDate: string | null;
  toggleSelectedDate: (date: string) => void;
}

const GraphContext = createContext<GraphContextValue | null>(null);

const useGraphContext = (): GraphContextValue => {
  const context = use(GraphContext);
  if (!context) {
    throw new Error("ContributionGraph parts must be rendered inside Root");
  }
  return context;
};

export const useContributionCount = (date: string): number =>
  useGraphContext().counts.get(date) ?? 0;

const LEVEL_COLORS = [
  "data-[level='0']:bg-primary/10",
  "data-[level='1']:bg-primary/20",
  "data-[level='2']:bg-primary/40",
  "data-[level='3']:bg-primary/60",
  "data-[level='4']:bg-primary/80",
];

type RootProps = ComponentProps<"div"> & {
  data: ContributionData[];
};

export const Root = ({ data, className, ...props }: RootProps) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const context: GraphContextValue = {
    counts: new Map(data.map((item) => [item.date, item.count])),
    selectedDate,
    toggleSelectedDate: (date) =>
      setSelectedDate((current) => (current === date ? null : date)),
  };

  return (
    <GraphContext value={context}>
      <div
        className={cn(
          "flex min-w-max flex-col space-y-2 overflow-x-auto text-xs",
          className
        )}
        {...props}
      />
    </GraphContext>
  );
};

export const Grid = ({ className, ...props }: ComponentProps<"table">) => (
  <table
    aria-label="Contribution graph"
    className={cn("border-separate border-spacing-0.5", className)}
    role="grid"
    {...props}
  />
);

export const HeaderCell = ({ className, ...props }: ComponentProps<"th">) => (
  <th className={cn("p-0 text-left align-bottom", className)} {...props} />
);

type DateCellProps = ComponentProps<"button"> & { date: string };

const DateCell = ({ date, className, ...props }: DateCellProps) => {
  const { counts, selectedDate, toggleSelectedDate } = useGraphContext();
  const isSelected = selectedDate === date;
  const isToday = date === toISODateString(new Date());

  return (
    <td>
      <button
        {...mergeProps<"button">(
          {
            "aria-current": isToday ? "date" : undefined,
            "aria-selected": isSelected,
            className: cn(
              "size-2.5 rounded-xs outline-none",
              "focus-visible:ring-2 focus-visible:ring-ring",
              "data-[selected]:ring-2 data-[selected]:ring-ring",
              "data-[today]:ring-1 data-[today]:ring-foreground/50",
              LEVEL_COLORS,
              className
            ),
            "data-level": getLevelForCount(counts.get(date) ?? 0),
            "data-selected": isSelected || undefined,
            "data-today": isToday || undefined,
            onClick: () => toggleSelectedDate(date),
            role: "gridcell",
            type: "button",
          } as ComponentProps<"button">,
          props
        )}
      />
    </td>
  );
};

type CellProps = Omit<DateCellProps, "date"> & { date: string | undefined };

export const Cell = ({ date, ...props }: CellProps) =>
  date ? <DateCell date={date} {...props} /> : <td />;

export const Label = ({ className, ...props }: ComponentProps<"span">) => (
  <span
    className={cn(
      "font-medium text-muted-foreground text-xs leading-none",
      className
    )}
    {...props}
  />
);

export const Legend = ({ className, ...props }: ComponentProps<"div">) => (
  <div className={cn("flex items-center gap-1", className)} {...props} />
);

type LegendItemProps = ComponentProps<"span"> & { level: number };

export const LegendItem = ({ level, className, ...props }: LegendItemProps) => (
  <span
    aria-label={`Level ${level}`}
    className={cn("size-2.5 rounded-xs", LEVEL_COLORS, className)}
    data-level={level}
    {...props}
  />
);
