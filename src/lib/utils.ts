import { createIsomorphicFn } from "@tanstack/react-start";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

export const isProd = createIsomorphicFn()
  .server(() => process.env.NODE_ENV === "production")
  .client(() => import.meta.env.PROD);

export const isServer = createIsomorphicFn()
  .server(() => true)
  .client(() => false);

export function getInitials(text: string) {
  return text
    .split(" ")
    .map((word) => word[0].toUpperCase())
    .join("");
}
