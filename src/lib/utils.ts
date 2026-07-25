import { createIsomorphicFn } from "@tanstack/react-start";
import { clsx } from "clsx";
import type { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const delay = (ms: number): Promise<void> =>
  // oxlint-disable-next-line avoid-new -- setTimeout has no native Promise wrapper in browsers
  new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });

export const isPromise = (value: unknown): value is PromiseLike<unknown> =>
  typeof value === "object" &&
  value !== null &&
  "then" in value &&
  typeof value.then === "function";

export const isFunction = <T>(
  value: T | ((prev: T) => T)
): value is (prev: T) => T => typeof value === "function";

export const isProd = createIsomorphicFn()
  .server(() => process.env.NODE_ENV === "production")
  .client(() => import.meta.env.PROD);

export const isServer = createIsomorphicFn()
  .server(() => true)
  .client(() => false);

export const getInitials = (text: string) =>
  text
    .split(" ")
    .map((word) => {
      const alphanumeric = word.replaceAll(/[^a-zA-Z0-9]/g, "");
      return alphanumeric[0]?.toUpperCase() || "";
    })
    .filter(Boolean)
    .join("");
