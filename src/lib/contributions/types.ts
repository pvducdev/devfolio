export type ContributionData = {
  date: string;
  count: number;
};

export type ContributionSource = "GitHub" | "GitLab";

export type DateRange = {
  from: string;
  to: string;
};

export type ContributionProvider = (
  username: string,
  token?: string,
  range?: DateRange
) => Promise<ContributionData[]>;
