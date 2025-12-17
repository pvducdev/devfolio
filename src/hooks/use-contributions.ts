import { useMemo } from "react";

import { toISODateString } from "@/lib/utils";

type WeekStartDay = 0 | 1; // 0 = Sunday, 1 = Monday

type MonthLabel = {
  month: number;
  year: number;
  label: string;
  colStart: number;
  colSpan: number;
};

type WeekdayLabel = {
  day: number;
  label: string;
  shortLabel: string;
};

type UseContributionGraphDatesOptions = {
  startDate?: Date;
  endDate?: Date;
  weekStartDay?: WeekStartDay;
  monthLabelFormat?: "short" | "long";
  weekdayLabelFormat?: "short" | "narrow";
  locale?: string;
};

type UseContributionGraphDatesReturn = {
  dates: string[];
  weeks: string[][];
  monthLabels: MonthLabel[];
  weekdayLabels: WeekdayLabel[];
  totalWeeks: number;
  startDate: Date;
  endDate: Date;
};

const DEFAULT_WEEKDAY_ORDER_SUNDAY: number[] = [0, 1, 2, 3, 4, 5, 6];
const DEFAULT_WEEKDAY_ORDER_MONDAY: number[] = [1, 2, 3, 4, 5, 6, 0];

function getWeekdayOrder(weekStartDay: WeekStartDay): number[] {
  return weekStartDay === 0
    ? DEFAULT_WEEKDAY_ORDER_SUNDAY
    : DEFAULT_WEEKDAY_ORDER_MONDAY;
}

function getDayIndex(date: Date, weekStartDay: WeekStartDay): number {
  const day = date.getDay();
  if (weekStartDay === 0) {
    return day;
  }
  return day === 0 ? 6 : day - 1;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function getWeekStart(date: Date, weekStartDay: WeekStartDay): Date {
  const result = new Date(date);
  const dayIndex = getDayIndex(date, weekStartDay);
  result.setDate(result.getDate() - dayIndex);
  return result;
}

function generateWeekdayLabels(
  weekStartDay: WeekStartDay,
  format: "short" | "narrow",
  locale: string
): WeekdayLabel[] {
  const weekdayOrder = getWeekdayOrder(weekStartDay);
  const baseDate = new Date(2024, 0, 7);

  return weekdayOrder.map((day) => {
    const date = addDays(baseDate, day);
    return {
      day,
      label: date.toLocaleDateString(locale, { weekday: format }),
      shortLabel: date.toLocaleDateString(locale, { weekday: "narrow" }),
    };
  });
}

function updateLastLabelColSpan(labels: MonthLabel[], weekIndex: number): void {
  const lastLabel = labels.at(-1);
  if (lastLabel) {
    lastLabel.colSpan = weekIndex - lastLabel.colStart;
  }
}

function getFirstDateInWeek(week: string[]): string | undefined {
  return week.find((d) => d !== "");
}

function generateMonthLabels(
  weeks: string[][],
  format: "short" | "long",
  locale: string
): MonthLabel[] {
  const labels: MonthLabel[] = [];
  let currentMonth = -1;
  let currentYear = -1;

  for (let weekIndex = 0; weekIndex < weeks.length; weekIndex++) {
    const firstDateInWeek = getFirstDateInWeek(weeks[weekIndex]);
    if (!firstDateInWeek) {
      continue;
    }

    const date = new Date(firstDateInWeek);
    const month = date.getMonth();
    const year = date.getFullYear();

    if (month !== currentMonth || year !== currentYear) {
      if (currentMonth !== -1) {
        updateLastLabelColSpan(labels, weekIndex);
      }

      labels.push({
        month,
        year,
        label: date.toLocaleDateString(locale, { month: format }),
        colStart: weekIndex,
        colSpan: 1,
      });

      currentMonth = month;
      currentYear = year;
    }
  }

  updateLastLabelColSpan(labels, weeks.length);
  return labels;
}

export function useContributionGraphDates(
  options: UseContributionGraphDatesOptions = {}
): UseContributionGraphDatesReturn {
  const {
    endDate: endDateProp,
    startDate: startDateProp,
    weekStartDay = 0,
    monthLabelFormat = "short",
    weekdayLabelFormat = "short",
    locale = "en-US",
  } = options;

  return useMemo(() => {
    const endDate = endDateProp ?? new Date();
    const startDate =
      startDateProp ??
      (() => {
        const date = new Date(endDate);
        date.setFullYear(date.getFullYear() - 1);
        return date;
      })();

    // Align start to beginning of week
    const alignedStart = getWeekStart(startDate, weekStartDay);

    // Generate all weeks and dates
    const weeks: string[][] = [];
    const dates: string[] = [];
    let currentDate = new Date(alignedStart);

    while (currentDate <= endDate) {
      const week: string[] = [];

      for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        const dateStr = toISODateString(currentDate);

        // Only include dates within the actual range
        if (currentDate >= startDate && currentDate <= endDate) {
          week.push(dateStr);
          dates.push(dateStr);
        } else {
          week.push("");
        }

        currentDate = addDays(currentDate, 1);
      }

      weeks.push(week);
    }

    const monthLabels = generateMonthLabels(weeks, monthLabelFormat, locale);
    const weekdayLabels = generateWeekdayLabels(
      weekStartDay,
      weekdayLabelFormat,
      locale
    );

    return {
      dates,
      weeks,
      monthLabels,
      weekdayLabels,
      totalWeeks: weeks.length,
      startDate,
      endDate,
    };
  }, [
    endDateProp,
    startDateProp,
    weekStartDay,
    monthLabelFormat,
    weekdayLabelFormat,
    locale,
  ]);
}

export type {
  MonthLabel,
  UseContributionGraphDatesOptions,
  UseContributionGraphDatesReturn,
  WeekdayLabel,
  WeekStartDay,
};
