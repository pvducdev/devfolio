import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { useMemo, useState } from "react";
import type { ComponentProps, MouseEvent, ReactNode } from "react";

import { useControllableState } from "@/hooks/use-controllable-state";
import createCtx from "@/lib/create-ctx";
import { isWeekend as defaultIsWeekend, toISODateString } from "@/lib/date";

const defaultIsToday = (date: string): boolean =>
  date === toISODateString(new Date());

interface ContributionData {
  date: Date | string;
  count: number;
  level?: number;
}

interface ContextValue {
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
}

const [useContributionGraph, Provider] = createCtx<ContextValue>(
  "useContributionGraph must be used within a ContributionGraph"
);

const getDefaultLevelThresholds =
  (levels: number): ((count: number, max: number) => number) =>
  (count: number, max: number) => {
    if (count === 0 || max === 0) {
      return 0;
    }
    const ratio = count / max;
    const level = Math.ceil(ratio * (levels - 1));
    return Math.min(level, levels - 1);
  };

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

const Root = ({
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
}: RootProps) => {
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
    defaultProp: defaultSelectedDate ?? null,
    onChange: onSelectedDateChange,
    prop: selectedDateProp,
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
    endDate,
    getDataForDate,
    getLevelForCount,
    hoveredDate,
    isToday,
    isWeekend,
    levels,
    maxCount,
    onHoverDate: handleHoverDate,
    onSelectDate: setSelectedDate,
    selectedDate: selectedDate ?? null,
    startDate,
  };

  return (
    <Provider value={contextValue}>
      <div data-slot="contribution-graph" {...props}>
        {children}
      </div>
    </Provider>
  );
};

type GridProps = useRender.ComponentProps<"table">;

const Grid = ({ render, ...props }: GridProps) =>
  useRender({
    defaultTagName: "table",
    props: mergeProps<"table">(
      {
        "aria-label": "Contribution graph",
        "data-slot": "contribution-graph-grid",
        role: "grid",
      } as ComponentProps<"table">,
      props
    ),
    render,
  });

type HeadProps = useRender.ComponentProps<"thead">;

const Head = ({ render, ...props }: HeadProps) =>
  useRender({
    defaultTagName: "thead",
    props: mergeProps<"thead">(
      { "data-slot": "contribution-graph-head" } as ComponentProps<"thead">,
      props
    ),
    render,
  });

type BodyProps = useRender.ComponentProps<"tbody">;

const Body = ({ render, ...props }: BodyProps) =>
  useRender({
    defaultTagName: "tbody",
    props: mergeProps<"tbody">(
      { "data-slot": "contribution-graph-body" } as ComponentProps<"tbody">,
      props
    ),
    render,
  });

type RowProps = useRender.ComponentProps<"tr">;

const Row = ({ render, ...props }: RowProps) =>
  useRender({
    defaultTagName: "tr",
    props: mergeProps<"tr">(
      {
        "data-slot": "contribution-graph-row",
        role: "row",
      } as ComponentProps<"tr">,
      props
    ),
    render,
  });

type HeaderCellProps = useRender.ComponentProps<"th">;

const HeaderCell = ({ render, ...props }: HeaderCellProps) =>
  useRender({
    defaultTagName: "th",
    props: mergeProps<"th">(
      {
        "data-slot": "contribution-graph-header-cell",
      } as ComponentProps<"th">,
      props
    ),
    render,
  });

interface CellState {
  date: string;
  count: number;
  level: number;
  isSelected: boolean;
  isToday: boolean;
  isWeekend: boolean;
  isEmpty: boolean;
}

type CellProps = Omit<
  useRender.ComponentProps<"button">,
  "onClick" | "onMouseEnter" | "onMouseLeave"
> & {
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

const Cell = ({
  render,
  date,
  onClick,
  onMouseEnter,
  onMouseLeave,
  ...props
}: CellProps) => {
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

  const cellState: CellState = {
    count,
    date,
    isEmpty,
    isSelected,
    isToday: isTodayDay,
    isWeekend: isWeekendDay,
    level,
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

  const cellElement = useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        "aria-current": isTodayDay ? "date" : undefined,
        "aria-selected": isSelected,
        "data-count": count,
        "data-date": date,
        "data-empty": isEmpty || undefined,
        "data-level": level,
        "data-selected": isSelected || undefined,
        "data-slot": "contribution-graph-cell",
        "data-today": isTodayDay || undefined,
        "data-weekend": isWeekendDay || undefined,
        onClick: handleClick,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        role: "gridcell",
        type: render ? undefined : "button",
      } as ComponentProps<"button">,
      props
    ),
    render,
  });

  return <td data-slot="contribution-graph-cell-wrapper">{cellElement}</td>;
};

type LabelProps = useRender.ComponentProps<"span"> & {
  value?: number;
};

const Label = ({ value, render, ...props }: LabelProps) =>
  useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        "data-slot": "contribution-graph-label",
        "data-value": value,
      } as ComponentProps<"span">,
      props
    ),
    render,
  });

type LegendProps = useRender.ComponentProps<"div">;

const Legend = ({ render, ...props }: LegendProps) =>
  useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      { "data-slot": "contribution-graph-legend" } as ComponentProps<"div">,
      props
    ),
    render,
  });

type LegendItemProps = useRender.ComponentProps<"span"> & {
  level: number;
};

const LegendItem = ({ level, render, ...props }: LegendItemProps) =>
  useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        "aria-label": `Level ${level}`,
        "data-level": level,
        "data-slot": "contribution-graph-legend-item",
      } as ComponentProps<"span">,
      props
    ),
    render,
  });

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
