export function toISODateString(
  date: Date | string | null | undefined
): string {
  if (date === null || date === undefined) {
    return "";
  }

  const d = typeof date === "string" ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) {
    return "";
  }

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function isWeekend(dateStr: string): boolean {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) {
    return false;
  }
  const day = date.getDay();

  return day === 0 || day === 6;
}

export function formatMonth(month: number, locale: string): string {
  const date = new Date(new Date().getFullYear(), month, 1);

  return date.toLocaleDateString(locale, { month: "short" });
}

export function formatWeekday(day: number, locale: string): string {
  const year = new Date().getFullYear();
  const jan1 = new Date(year, 0, 1);
  const daysUntilSunday = (7 - jan1.getDay()) % 7;
  const firstSunday = new Date(year, 0, 1 + daysUntilSunday);
  const targetDay = new Date(firstSunday);
  targetDay.setDate(firstSunday.getDate() + day);

  return targetDay.toLocaleDateString(locale, { weekday: "narrow" });
}

export function formatDateShort(dateStr: string, locale: string): string {
  const date = new Date(dateStr);

  return date.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
