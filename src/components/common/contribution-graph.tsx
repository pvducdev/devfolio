import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

import {
  ContributionGraphCell as ContributionGraphCellPrimitive,
  type ContributionGraphCellProps as ContributionGraphCellPrimitiveProps,
  ContributionGraphContent as ContributionGraphContentPrimitive,
  type ContributionGraphContentProps as ContributionGraphContentPrimitiveProps,
  ContributionGraphGrid as ContributionGraphGridPrimitive,
  type ContributionGraphGridProps as ContributionGraphGridPrimitiveProps,
  ContributionGraphLabel as ContributionGraphLabelPrimitive,
  type ContributionGraphLabelProps as ContributionGraphLabelPrimitiveProps,
  ContributionGraphLabels as ContributionGraphLabelsPrimitive,
  type ContributionGraphLabelsProps as ContributionGraphLabelsPrimitiveProps,
  ContributionGraphLegendItem as ContributionGraphLegendItemPrimitive,
  type ContributionGraphLegendItemProps as ContributionGraphLegendItemPrimitiveProps,
  ContributionGraphLegend as ContributionGraphLegendPrimitive,
  type ContributionGraphLegendProps as ContributionGraphLegendPrimitiveProps,
  ContributionGraphPrimitive,
  type ContributionGraphProps as ContributionGraphPrimitiveProps,
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
      className={cn("flex flex-col gap-2 text-sm", className)}
      {...props}
    />
  );
}

type ContributionGraphContentProps = ContributionGraphContentPrimitiveProps;

function ContributionGraphContent({
  className,
  ...props
}: ContributionGraphContentProps) {
  return (
    <ContributionGraphContentPrimitive
      className={cn("flex gap-1", className)}
      {...props}
    />
  );
}

type ContributionGraphGridProps = ContributionGraphGridPrimitiveProps;

function ContributionGraphGrid({
  className,
  orientation = "horizontal",
  ...props
}: ContributionGraphGridProps) {
  return (
    <ContributionGraphGridPrimitive
      className={cn(
        "grid gap-0.5",
        orientation === "horizontal"
          ? "auto-cols-max grid-flow-col"
          : "grid-flow-row auto-rows-max",
        className
      )}
      orientation={orientation}
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

type ContributionGraphLabelsProps = ContributionGraphLabelsPrimitiveProps;

function ContributionGraphLabels({
  className,
  type,
  ...props
}: ContributionGraphLabelsProps) {
  return (
    <ContributionGraphLabelsPrimitive
      className={cn(
        "text-muted-foreground text-xs",
        type === "months"
          ? "flex justify-between"
          : "flex flex-col justify-between",
        className
      )}
      type={type}
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
      className={cn(
        "flex items-center gap-1 text-muted-foreground text-xs",
        className
      )}
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
  ContributionGraphCell,
  ContributionGraphContent,
  ContributionGraphGrid,
  ContributionGraphLabel,
  ContributionGraphLabels,
  ContributionGraphLegend,
  ContributionGraphLegendItem,
  contributionGraphCellVariants,
  contributionGraphLegendItemVariants,
};

export type {
  ContributionData,
  ContributionGraphProps as ContributionGraphPrimitiveProps,
} from "./contribution-graph-primitive";
// biome-ignore lint/performance/noBarrelFile: Re-exports needed for styled wrapper pattern
export { useContributionGraph } from "./contribution-graph-primitive";

export type {
  ContributionGraphCellProps,
  ContributionGraphContentProps,
  ContributionGraphGridProps,
  ContributionGraphLabelProps,
  ContributionGraphLabelsProps,
  ContributionGraphLegendItemProps,
  ContributionGraphLegendProps,
  ContributionGraphProps,
};
