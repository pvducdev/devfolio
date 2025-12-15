const THRESHOLDS = [0.75, 0.5, 0.25, 0] as const;

export const calculateContributionLevel = (ratio: number): number => {
  const index = THRESHOLDS.findIndex((t) => ratio > t);
  return index === -1 ? 0 : 4 - index;
};
