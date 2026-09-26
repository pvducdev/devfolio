import { toISODateString } from "./format";

interface MonthInfo {
  month: number;
  year: number;
  colStart: number;
  colSpan: number;
}

const WEEKDAYS = [0, 1, 2, 3, 4, 5, 6];

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const buildWeeks = (startDate: Date, endDate: Date): string[][] => {
  const weeks: string[][] = [];

  for (
    let weekStart = addDays(startDate, -startDate.getDay());
    weekStart <= endDate;
    weekStart = addDays(weekStart, WEEKDAYS.length)
  ) {
    weeks.push(
      WEEKDAYS.map((day) => {
        const date = addDays(weekStart, day);
        return date >= startDate && date <= endDate
          ? toISODateString(date)
          : "";
      })
    );
  }

  return weeks;
};

const buildMonths = (weeks: string[][]): MonthInfo[] => {
  const months: MonthInfo[] = [];

  for (const [weekIndex, week] of weeks.entries()) {
    const firstDate = week.find(Boolean);
    if (!firstDate) {
      continue;
    }

    const date = new Date(firstDate);
    const last = months.at(-1);
    if (last?.month === date.getMonth() && last.year === date.getFullYear()) {
      continue;
    }

    if (last) {
      last.colSpan = weekIndex - last.colStart;
    }
    months.push({
      colSpan: weeks.length - weekIndex,
      colStart: weekIndex,
      month: date.getMonth(),
      year: date.getFullYear(),
    });
  }

  return months;
};

export const buildContributionCalendar = () => {
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setFullYear(startDate.getFullYear() - 1);

  const weeks = buildWeeks(startDate, endDate);

  return { months: buildMonths(weeks), weekdays: WEEKDAYS, weeks };
};
