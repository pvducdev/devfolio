import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

// biome-ignore lint/performance/noNamespaceImport: primitive pattern
import * as Primitive from "./contribution-graph-primitive";

const cellVariants = cva([
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

const legendItemVariants = cva("size-2.5 rounded-xs", {
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

type RootProps = Omit<Primitive.RootProps, "children">;

function Root({
  className,
  ...props
}: RootProps & { className?: string; children: React.ReactNode }) {
  return (
    <Primitive.Root
      className={cn(
        "flex min-w-max flex-col gap-1.5 overflow-x-auto text-xs",
        className
      )}
      {...props}
    />
  );
}

type GridProps = Primitive.GridProps;

function Grid({ className, ...props }: GridProps) {
  return (
    <Primitive.Grid
      className={cn("border-separate border-spacing-0.5", className)}
      {...props}
    />
  );
}

type HeadProps = Primitive.HeadProps;

function Head({ className, ...props }: HeadProps) {
  return <Primitive.Head className={cn(className)} {...props} />;
}

type BodyProps = Primitive.BodyProps;

function Body({ className, ...props }: BodyProps) {
  return <Primitive.Body className={cn(className)} {...props} />;
}

type RowProps = Primitive.RowProps;

function Row({ className, ...props }: RowProps) {
  return <Primitive.Row className={cn(className)} {...props} />;
}

type HeaderCellProps = Primitive.HeaderCellProps;

function HeaderCell({ className, ...props }: HeaderCellProps) {
  return (
    <Primitive.HeaderCell
      className={cn("p-0 text-left align-bottom", className)}
      {...props}
    />
  );
}

type CellProps = Primitive.CellProps;

function Cell({ className, ...props }: CellProps) {
  return (
    <Primitive.Cell className={cn(cellVariants(), className)} {...props} />
  );
}

type LabelProps = Primitive.LabelProps;

function Label({ className, ...props }: LabelProps) {
  return (
    <Primitive.Label
      className={cn("text-muted-foreground text-xs leading-none", className)}
      {...props}
    />
  );
}

type LegendProps = Primitive.LegendProps;

function Legend({ className, ...props }: LegendProps) {
  return (
    <Primitive.Legend
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  );
}

type LegendItemProps = Primitive.LegendItemProps &
  VariantProps<typeof legendItemVariants>;

function LegendItem({ className, level, ...props }: LegendItemProps) {
  return (
    <Primitive.LegendItem
      className={cn(legendItemVariants({ level }), className)}
      level={level ?? 0}
      {...props}
    />
  );
}

export {
  Body,
  Cell,
  cellVariants,
  Grid,
  Head,
  HeaderCell,
  Label,
  Legend,
  LegendItem,
  legendItemVariants,
  Root,
  Row,
};

export type {
  CellState,
  ContributionData,
} from "./contribution-graph-primitive";

export type {
  BodyProps,
  CellProps,
  GridProps,
  HeaderCellProps,
  HeadProps,
  LabelProps,
  LegendItemProps,
  LegendProps,
  RootProps,
  RowProps,
};
