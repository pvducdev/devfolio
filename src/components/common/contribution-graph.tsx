import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

import {
  ContributionGraphBody as ContributionGraphBodyPrimitive,
  type ContributionGraphBodyProps as ContributionGraphBodyPrimitiveProps,
  ContributionGraphCell as ContributionGraphCellPrimitive,
  type ContributionGraphCellProps as ContributionGraphCellPrimitiveProps,
  ContributionGraphGrid as ContributionGraphGridPrimitive,
  type ContributionGraphGridProps as ContributionGraphGridPrimitiveProps,
  ContributionGraphHeaderCell as ContributionGraphHeaderCellPrimitive,
  type ContributionGraphHeaderCellProps as ContributionGraphHeaderCellPrimitiveProps,
  ContributionGraphHead as ContributionGraphHeadPrimitive,
  type ContributionGraphHeadProps as ContributionGraphHeadPrimitiveProps,
  ContributionGraphLabel as ContributionGraphLabelPrimitive,
  type ContributionGraphLabelProps as ContributionGraphLabelPrimitiveProps,
  ContributionGraphLegendItem as ContributionGraphLegendItemPrimitive,
  type ContributionGraphLegendItemProps as ContributionGraphLegendItemPrimitiveProps,
  ContributionGraphLegend as ContributionGraphLegendPrimitive,
  type ContributionGraphLegendProps as ContributionGraphLegendPrimitiveProps,
  ContributionGraphPrimitive,
  type ContributionGraphProps as ContributionGraphPrimitiveProps,
  ContributionGraphRow as ContributionGraphRowPrimitive,
  type ContributionGraphRowProps as ContributionGraphRowPrimitiveProps,
} from "./contribution-graph-primitive";

const contributionGraphCellVariants = cva([
  "size-2.5 rounded-xs outline-none transition-colors",
  "focus-visible:ring-2 focus-visible:ring-ring",
  "data-[selected]:ring-2 data-[selected]:ring-ring",
  "data-[today]:ring-1 data-[today]:ring-foreground/50",
  "data-[level='0']:bg-muted/40",
  "data-[level='1']:bg-primary/20",
  "data-[level='2']:bg-primary/40",
  "data-[level='3']:bg-primary/60",
  "data-[level='4']:bg-primary/80",
]);

const contributionGraphLegendItemVariants = cva("size-2.5 rounded-xs", {
  variants: {
    level: {
      0: "bg-muted/40",
      1: "bg-primary/20",
      2: "bg-primary/40",
      3: "bg-primary/60",
      4: "bg-primary/80",
    },
  },
  defaultVariants: {
    level: 0,
  },
});

type ContributionGraphProps = Omit<ContributionGraphPrimitiveProps, "children">;

function ContributionGraph({
  className,
  ...props
}: ContributionGraphProps & { className?: string; children: React.ReactNode }) {
  return (
    <ContributionGraphPrimitive
      className={cn(
        "flex min-w-max flex-col gap-1.5 overflow-x-auto text-xs",
        className
      )}
      {...props}
    />
  );
}

type ContributionGraphGridProps = ContributionGraphGridPrimitiveProps;

function ContributionGraphGrid({
  className,
  ...props
}: ContributionGraphGridProps) {
  return (
    <ContributionGraphGridPrimitive
      className={cn("border-separate border-spacing-0.5", className)}
      {...props}
    />
  );
}

type ContributionGraphHeadProps = ContributionGraphHeadPrimitiveProps;

function ContributionGraphHead({
  className,
  ...props
}: ContributionGraphHeadProps) {
  return (
    <ContributionGraphHeadPrimitive className={cn(className)} {...props} />
  );
}

type ContributionGraphBodyProps = ContributionGraphBodyPrimitiveProps;

function ContributionGraphBody({
  className,
  ...props
}: ContributionGraphBodyProps) {
  return (
    <ContributionGraphBodyPrimitive className={cn(className)} {...props} />
  );
}

type ContributionGraphRowProps = ContributionGraphRowPrimitiveProps;

function ContributionGraphRow({
  className,
  ...props
}: ContributionGraphRowProps) {
  return <ContributionGraphRowPrimitive className={cn(className)} {...props} />;
}

type ContributionGraphHeaderCellProps =
  ContributionGraphHeaderCellPrimitiveProps;

function ContributionGraphHeaderCell({
  className,
  ...props
}: ContributionGraphHeaderCellProps) {
  return (
    <ContributionGraphHeaderCellPrimitive
      className={cn("p-0 text-left align-bottom", className)}
      {...props}
    />
  );
}

type ContributionGraphCellProps = ContributionGraphCellPrimitiveProps;

function ContributionGraphCell({
  className,
  ...props
}: ContributionGraphCellProps) {
  return (
    <ContributionGraphCellPrimitive
      className={cn(contributionGraphCellVariants(), className)}
      {...props}
    />
  );
}

type ContributionGraphLabelProps = ContributionGraphLabelPrimitiveProps;

function ContributionGraphLabel({
  className,
  ...props
}: ContributionGraphLabelProps) {
  return (
    <ContributionGraphLabelPrimitive
      className={cn("text-muted-foreground text-xs leading-none", className)}
      {...props}
    />
  );
}

type ContributionGraphLegendProps = ContributionGraphLegendPrimitiveProps;

function ContributionGraphLegend({
  className,
  ...props
}: ContributionGraphLegendProps) {
  return (
    <ContributionGraphLegendPrimitive
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  );
}

type ContributionGraphLegendItemProps =
  ContributionGraphLegendItemPrimitiveProps &
    VariantProps<typeof contributionGraphLegendItemVariants>;

function ContributionGraphLegendItem({
  className,
  level,
  ...props
}: ContributionGraphLegendItemProps) {
  return (
    <ContributionGraphLegendItemPrimitive
      className={cn(contributionGraphLegendItemVariants({ level }), className)}
      level={level ?? 0}
      {...props}
    />
  );
}

export {
  ContributionGraph,
  ContributionGraphBody,
  ContributionGraphCell,
  ContributionGraphGrid,
  ContributionGraphHead,
  ContributionGraphHeaderCell,
  ContributionGraphLabel,
  ContributionGraphLegend,
  ContributionGraphLegendItem,
  ContributionGraphRow,
  contributionGraphCellVariants,
  contributionGraphLegendItemVariants,
};

export type {
  CellState,
  ContributionData,
  ContributionGraphProps as ContributionGraphPrimitiveProps,
} from "./contribution-graph-primitive";

export type {
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
