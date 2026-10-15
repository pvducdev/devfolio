import { CONTRIBUTIONS_CONFIG } from "@/config/contributions";
import type { ContributionData } from "@/lib/contributions";
import {
  page_about_contribution_level_more,
  page_about_contribution_level_none,
  page_about_contribution_level_range,
  page_about_contribution_summary,
} from "@/paraglide/messages.js";

import type { ContributionLevel } from "./contribution-levels";

export const formatISODate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const formatMonth = (month: number, locale: string): string =>
  new Date(new Date().getFullYear(), month, 1).toLocaleDateString(locale, {
    month: "short",
  });

const getWeekdayDate = (day: number): Date => new Date(2023, 0, 1 + day);

export const formatWeekday = (day: number, locale: string): string =>
  getWeekdayDate(day).toLocaleDateString(locale, { weekday: "narrow" });

export const formatDateShort = (dateStr: string, locale: string): string =>
  new Date(dateStr).toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export const formatLevelLabel = (level: ContributionLevel): string => {
  if (level.max === 0) {
    return page_about_contribution_level_none();
  }

  if (level.max === undefined) {
    return page_about_contribution_level_more({ min: level.min });
  }

  return page_about_contribution_level_range({
    max: level.max,
    min: level.min,
  });
};

export const formatContributionSummary = (data: ContributionData[]): string =>
  page_about_contribution_summary({
    count: data.reduce((sum, item) => sum + item.count, 0),
    platform: CONTRIBUTIONS_CONFIG.source,
  });
