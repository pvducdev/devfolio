import { Slot } from "@radix-ui/react-slot";
import {
  type ComponentProps,
  type MouseEvent,
  type ReactNode,
  useMemo,
  useState,
} from "react";

import { useControllableState } from "@/hooks/use-controllable-state";
import createCtx from "@/lib/create-ctx";
import { isWeekend as defaultIsWeekend, toISODateString } from "@/lib/date";

const defaultIsToday = (date: string): boolean =>
  date === toISODateString(new Date());

type ContributionData = {
  date: Date | string;
  count: number;
  level?: number;
};

type ContextValue = {
  data: Map<string, ContributionData>;
  startDate: string;
  endDate: string;
  levels: number;
  maxCount: number;
  getLevelForCount: (count: number) => number;
  getDataForDate: (date: string) => ContributionData | undefined;
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
  hoveredDate: string | null;
  onHoverDate: (date: string | null) => void;
  isWeekend: (date: string) => boolean;
  isToday: (date: string) => boolean;
};

const [useContributionGraph, Provider] = createCtx<ContextValue>(
  "useContributionGraph must be used within a ContributionGraph"
);

function getDefaultLevelThresholds(
  levels: number
): (count: number, max: number) => number {
  return (count: number, max: number) => {
    if (count === 0 || max === 0) {
      return 0;
    }
    const ratio = count / max;
    const level = Math.ceil(ratio * (levels - 1));
    return Math.min(level, levels - 1);
  };
}

type RootProps = ComponentProps<"div"> & {
  data: ContributionData[];
  startDate?: string;
  endDate?: string;
  levels?: number;
  levelThresholds?: (count: number, max: number) => number;
  selectedDate?: string | null;
  defaultSelectedDate?: string | null;
  onSelectedDateChange?: (date: string | null) => void;
  onHoverDateChange?: (date: string | null) => void;
  isWeekend?: (date: string) => boolean;
  isToday?: (date: string) => boolean;
  children: ReactNode;
};

function Root({
  data,
  startDate: startDateProp,
  endDate: endDateProp,
  levels = 5,
  levelThresholds,
  selectedDate: selectedDateProp,
  defaultSelectedDate,
  onSelectedDateChange,
  onHoverDateChange,
  isWeekend = defaultIsWeekend,
  isToday = defaultIsToday,
  children,
  ...props
}: RootProps) {
  const endDate = useMemo(
    () => endDateProp ?? toISODateString(new Date()),
    [endDateProp]
  );

  const startDate = useMemo(() => {
    if (startDateProp) {
      return startDateProp;
    }

    const date = new Date(endDate);
    date.setFullYear(date.getFullYear() - 1);

    return toISODateString(date);
  }, [startDateProp, endDate]);

  const [selectedDate, setSelectedDate] = useControllableState({
    prop: selectedDateProp,
    defaultProp: defaultSelectedDate ?? null,
    onChange: onSelectedDateChange,
    caller: "ContributionGraph",
  });

  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const handleHoverDate = (date: string | null) => {
    setHoveredDate(date);
    onHoverDateChange?.(date);
  };

  const { dataMap, maxCount } = useMemo(() => {
    const map = new Map<string, ContributionData>();
    let max = 0;

    for (const item of data) {
      const key = toISODateString(item.date);
      map.set(key, item);
      if (item.count > max) {
        max = item.count;
      }
    }

    return { dataMap: map, maxCount: max };
  }, [data]);

  const getLevelForCount = (count: number): number => {
    const thresholdFn = levelThresholds ?? getDefaultLevelThresholds(levels);
    return thresholdFn(count, maxCount);
  };

  const getDataForDate = (date: string): ContributionData | undefined =>
    dataMap.get(date);

  const contextValue: ContextValue = {
    data: dataMap,
    startDate,
    endDate,
    levels,
    maxCount,
    getLevelForCount,
    getDataForDate,
    selectedDate: selectedDate ?? null,
    onSelectDate: setSelectedDate,
    hoveredDate,
    onHoverDate: handleHoverDate,
    isWeekend,
    isToday,
  };

  return (
    <Provider value={contextValue}>
      <div data-slot="contribution-graph" {...props}>
        {children}
      </div>
    </Provider>
  );
}

type GridProps = ComponentProps<"table"> & {
  asChild?: boolean;
};

function Grid({ asChild = false, ...props }: GridProps) {
  const Comp = asChild ? Slot : "table";

  return (
    <Comp
      aria-label="Contribution graph"
      data-slot="contribution-graph-grid"
      role="grid"
      {...props}
    />
  );
}

type HeadProps = ComponentProps<"thead"> & {
  asChild?: boolean;
};

function Head({ asChild = false, ...props }: HeadProps) {
  const Comp = asChild ? Slot : "thead";

  return <Comp data-slot="contribution-graph-head" {...props} />;
}

type BodyProps = ComponentProps<"tbody"> & {
  asChild?: boolean;
};

function Body({ asChild = false, ...props }: BodyProps) {
  const Comp = asChild ? Slot : "tbody";

  return <Comp data-slot="contribution-graph-body" {...props} />;
}

type RowProps = ComponentProps<"tr"> & {
  asChild?: boolean;
};

function Row({ asChild = false, ...props }: RowProps) {
  const Comp = asChild ? Slot : "tr";

  return <Comp data-slot="contribution-graph-row" role="row" {...props} />;
}

type HeaderCellProps = ComponentProps<"th"> & {
  asChild?: boolean;
};

function HeaderCell({ asChild = false, ...props }: HeaderCellProps) {
  const Comp = asChild ? Slot : "th";

  return <Comp data-slot="contribution-graph-header-cell" {...props} />;
}

type CellState = {
  date: string;
  count: number;
  level: number;
  isSelected: boolean;
  isToday: boolean;
  isWeekend: boolean;
  isEmpty: boolean;
};

type CellProps = Omit<
  ComponentProps<"button">,
  "onClick" | "onMouseEnter" | "onMouseLeave"
> & {
  asChild?: boolean;
  date: string;
  onClick?: (state: CellState, event: MouseEvent<HTMLButtonElement>) => void;
  onMouseEnter?: (
    state: CellState,
    event: MouseEvent<HTMLButtonElement>
  ) => void;
  onMouseLeave?: (
    state: CellState,
    event: MouseEvent<HTMLButtonElement>
  ) => void;
};

function Cell({
  asChild = false,
  date,
  onClick,
  onMouseEnter,
  onMouseLeave,
  ...props
}: CellProps) {
  const ctx = useContributionGraph();

  if (!date) {
    return <td data-empty="true" data-slot="contribution-graph-cell" />;
  }

  const cellData = ctx.getDataForDate(date);
  const count = cellData?.count ?? 0;
  const level = cellData?.level ?? ctx.getLevelForCount(count);
  const isSelected = ctx.selectedDate === date;
  const isTodayDay = ctx.isToday(date);
  const isEmpty = !cellData;
  const isWeekendDay = ctx.isWeekend(date);

  const Comp = asChild ? Slot : "button";

  const cellState: CellState = {
    date,
    count,
    level,
    isSelected,
    isToday: isTodayDay,
    isWeekend: isWeekendDay,
    isEmpty,
  };

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    ctx.onSelectDate(isSelected ? null : date);
    onClick?.(cellState, event);
  };

  const handleMouseEnter = (event: MouseEvent<HTMLButtonElement>) => {
    ctx.onHoverDate(date);
    onMouseEnter?.(cellState, event);
  };

  const handleMouseLeave = (event: MouseEvent<HTMLButtonElement>) => {
    ctx.onHoverDate(null);
    onMouseLeave?.(cellState, event);
  };

  return (
    <td data-slot="contribution-graph-cell-wrapper">
      <Comp
        // biome-ignore lint/nursery/noLeakedRender: TS requires undefined
        aria-current={isTodayDay ? "date" : undefined}
        aria-selected={isSelected}
        data-count={count}
        data-date={date}
        data-empty={isEmpty || undefined}
        data-level={level}
        data-selected={isSelected || undefined}
        data-slot="contribution-graph-cell"
        data-today={isTodayDay || undefined}
        data-weekend={isWeekendDay || undefined}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="gridcell"
        type={asChild ? undefined : "button"}
        {...props}
      />
    </td>
  );
}

type LabelProps = ComponentProps<"span"> & {
  value?: number;
  asChild?: boolean;
};

function Label({ value, asChild = false, ...props }: LabelProps) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp data-slot="contribution-graph-label" data-value={value} {...props} />
  );
}

type LegendProps = ComponentProps<"div"> & {
  asChild?: boolean;
};

function Legend({ asChild = false, ...props }: LegendProps) {
  const Comp = asChild ? Slot : "div";

  return <Comp data-slot="contribution-graph-legend" {...props} />;
}

type LegendItemProps = ComponentProps<"span"> & {
  level: number;
  asChild?: boolean;
};

function LegendItem({ level, asChild = false, ...props }: LegendItemProps) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      aria-label={`Level ${level}`}
      data-level={level}
      data-slot="contribution-graph-legend-item"
      {...props}
    />
  );
}

export {
  Body,
  Cell,
  Grid,
  Head,
  HeaderCell,
  Label,
  Legend,
  LegendItem,
  Root,
  Row,
};

export type {
  BodyProps,
  CellProps,
  CellState,
  ContributionData,
  GridProps,
  HeaderCellProps,
  HeadProps,
  LabelProps,
  LegendItemProps,
  LegendProps,
  RootProps,
  RowProps,
};
