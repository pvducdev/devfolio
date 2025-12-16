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

export function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
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

  if (typeof date === "string") {
    if (!date.trim()) {
      return "";
    }
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) {
      return "";
    }
    return parsed.toISOString().split("T")[0];
  }

  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toISOString().split("T")[0];
}
