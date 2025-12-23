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

export function isFunction<T>(
  value: T | ((prev: T) => T)
): value is (prev: T) => T {
  return typeof value === "function";
}

const MAC_PLATFORM_REGEX = /Mac|iPod|iPhone|iPad/;

export function isMac(): boolean {
  if (typeof navigator === "undefined") {
    return false;
  }
  return MAC_PLATFORM_REGEX.test(navigator.platform);
}
