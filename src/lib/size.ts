export const percentSize = (value: number | null | undefined) =>
  typeof value === "number" ? `${value}%` : undefined;
