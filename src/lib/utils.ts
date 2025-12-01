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
