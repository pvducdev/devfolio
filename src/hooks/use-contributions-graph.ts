import { useMemo } from "react";

import { toISODateString } from "@/lib/date";

type WeekStartDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

interface MonthInfo {
  month: number;
  year: number;
  colStart: number;
  colSpan: number;
}

interface UseContributionGraphDatesOptions {
  startDate?: Date;
  endDate?: Date;
  weekStartDay?: WeekStartDay;
}

interface UseContributionGraphDatesReturn {
  dates: string[];
  weeks: string[][];
  months: MonthInfo[];
  weekdays: number[];
  totalWeeks: number;
  startDate: string;
  endDate: string;
}

function getWeekdayOrder(weekStartDay: WeekStartDay): number[] {
  const order: number[] = [];
  for (let i = 0; i < 7; i++) {
    order.push((weekStartDay + i) % 7);
  }
  return order;
}

function getDayIndex(date: Date, weekStartDay: WeekStartDay): number {
  const day = date.getDay();
  return (day - weekStartDay + 7) % 7;
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

function getFirstDateInWeek(week: string[]): string | undefined {
  return week.find((d) => d !== "");
}

function updateLastColSpan(labels: MonthInfo[], weekIndex: number): void {
  const lastLabel = labels.at(-1);
  if (lastLabel) {
    lastLabel.colSpan = weekIndex - lastLabel.colStart;
  }
}

function generateMonths(weeks: string[][]): MonthInfo[] {
  const labels: MonthInfo[] = [];
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
        updateLastColSpan(labels, weekIndex);
      }

      labels.push({
        month,
        year,
        colStart: weekIndex,
        colSpan: 1,
      });

      currentMonth = month;
      currentYear = year;
    }
  }

  updateLastColSpan(labels, weeks.length);
  return labels;
}

export function useContributionGraph(
  options: UseContributionGraphDatesOptions = {}
): UseContributionGraphDatesReturn {
  const {
    endDate: endDateProp,
    startDate: startDateProp,
    weekStartDay = 0,
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

    const alignedStart = getWeekStart(startDate, weekStartDay);
    const weeks: string[][] = [];
    const dates: string[] = [];
    let currentDate = new Date(alignedStart);

    while (currentDate <= endDate) {
      const week: string[] = [];

      for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        const dateStr = toISODateString(currentDate);

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

    const months = generateMonths(weeks);
    const weekdays = getWeekdayOrder(weekStartDay);

    return {
      dates,
      weeks,
      months,
      weekdays,
      totalWeeks: weeks.length,
      startDate: toISODateString(startDate),
      endDate: toISODateString(endDate),
    };
  }, [endDateProp, startDateProp, weekStartDay]);
}

export type {
  MonthInfo,
  UseContributionGraphDatesOptions,
  UseContributionGraphDatesReturn,
  WeekStartDay,
};
