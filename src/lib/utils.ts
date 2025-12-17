import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hashPath(path: string): string {
  return path.replace(/[^a-zA-Z0-9]/g, "-");
}

export function getFileName(path: string): string {
  return path.split("/").pop() || path;
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isPromise(value: unknown): value is PromiseLike<unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    "then" in value &&
    typeof value.then === "function"
  );
}

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
  const parts = dateStr.split("-");
  if (parts.length !== 3) {
    return false;
  }

  const [year, month, day] = parts.map(Number);
  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
    return false;
  }

  const date = new Date(year, month - 1, day);
  const dayOfWeek = date.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6;
}

export function isFunction<T>(
  value: T | ((prev: T) => T)
): value is (prev: T) => T {
  return typeof value === "function";
}
