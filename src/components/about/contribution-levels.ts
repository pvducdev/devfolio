export interface ContributionLevel {
  min: number;
  max?: number;
}

export const CONTRIBUTION_LEVELS: ContributionLevel[] = [
  { max: 0, min: 0 },
  { max: 2, min: 1 },
  { max: 5, min: 3 },
  { max: 9, min: 6 },
  { min: 10 },
];

export const getLevelForCount = (count: number): number =>
  CONTRIBUTION_LEVELS.findLastIndex((level) => count >= level.min);
