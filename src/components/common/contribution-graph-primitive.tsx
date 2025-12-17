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
import { isWeekend as defaultIsWeekend, toISODateString } from "@/lib/utils";

const defaultIsToday = (date: string): boolean =>
  date === toISODateString(new Date());

type ContributionData = {
  date: Date | string;
  count: number;
  level?: number;
};

type ContributionGraphContextValue = {
  data: Map<string, ContributionData>;
  startDate: Date;
  endDate: Date;
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

const [useContributionGraph, ContributionGraphProvider] =
  createCtx<ContributionGraphContextValue>(
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

type ContributionGraphProps = ComponentProps<"div"> & {
  data: ContributionData[];
  startDate?: Date;
  endDate?: Date;
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

function ContributionGraphPrimitive({
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
}: ContributionGraphProps) {
  const endDate = useMemo(() => endDateProp || new Date(), [endDateProp]);

  const startDate = useMemo(() => {
    if (startDateProp) {
      return startDateProp;
    }

    const date = new Date(endDate);
    date.setFullYear(date.getFullYear() - 1);

    return date;
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

  const contextValue: ContributionGraphContextValue = {
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
    <ContributionGraphProvider value={contextValue}>
      <div data-slot="contribution-graph" {...props}>
        {children}
      </div>
    </ContributionGraphProvider>
  );
}

type ContributionGraphGridProps = ComponentProps<"table"> & {
  asChild?: boolean;
};

function ContributionGraphGrid({
  asChild = false,
  ...props
}: ContributionGraphGridProps) {
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

type ContributionGraphHeadProps = ComponentProps<"thead"> & {
  asChild?: boolean;
};

function ContributionGraphHead({
  asChild = false,
  ...props
}: ContributionGraphHeadProps) {
  const Comp = asChild ? Slot : "thead";

  return <Comp data-slot="contribution-graph-head" {...props} />;
}

type ContributionGraphBodyProps = ComponentProps<"tbody"> & {
  asChild?: boolean;
};

function ContributionGraphBody({
  asChild = false,
  ...props
}: ContributionGraphBodyProps) {
  const Comp = asChild ? Slot : "tbody";

  return <Comp data-slot="contribution-graph-body" {...props} />;
}

type ContributionGraphRowProps = ComponentProps<"tr"> & {
  asChild?: boolean;
};

function ContributionGraphRow({
  asChild = false,
  ...props
}: ContributionGraphRowProps) {
  const Comp = asChild ? Slot : "tr";

  return <Comp data-slot="contribution-graph-row" role="row" {...props} />;
}

type ContributionGraphHeaderCellProps = ComponentProps<"th"> & {
  asChild?: boolean;
};

function ContributionGraphHeaderCell({
  asChild = false,
  ...props
}: ContributionGraphHeaderCellProps) {
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

type ContributionGraphCellProps = Omit<
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

function ContributionGraphCell({
  asChild = false,
  date,
  onClick,
  onMouseEnter,
  onMouseLeave,
  ...props
}: ContributionGraphCellProps) {
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

type ContributionGraphLabelProps = ComponentProps<"span"> & {
  value?: number;
  asChild?: boolean;
};

function ContributionGraphLabel({
  value,
  asChild = false,
  ...props
}: ContributionGraphLabelProps) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp data-slot="contribution-graph-label" data-value={value} {...props} />
  );
}

type ContributionGraphLegendProps = ComponentProps<"div"> & {
  asChild?: boolean;
};

function ContributionGraphLegend({
  asChild = false,
  ...props
}: ContributionGraphLegendProps) {
  const Comp = asChild ? Slot : "div";

  return <Comp data-slot="contribution-graph-legend" {...props} />;
}

type ContributionGraphLegendItemProps = ComponentProps<"span"> & {
  level: number;
  asChild?: boolean;
};

function ContributionGraphLegendItem({
  level,
  asChild = false,
  ...props
}: ContributionGraphLegendItemProps) {
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
  ContributionGraphBody,
  ContributionGraphCell,
  ContributionGraphGrid,
  ContributionGraphHead,
  ContributionGraphHeaderCell,
  ContributionGraphLabel,
  ContributionGraphLegend,
  ContributionGraphLegendItem,
  ContributionGraphPrimitive,
  ContributionGraphRow,
};

export type {
  CellState,
  ContributionData,
  ContributionGraphBodyProps,
  ContributionGraphCellProps,
  ContributionGraphGridProps,
  ContributionGraphHeaderCellProps,
  ContributionGraphHeadProps,
  ContributionGraphLabelProps,
  ContributionGraphLegendItemProps,
  ContributionGraphLegendProps,
  ContributionGraphProps,
  ContributionGraphRowProps,
};
