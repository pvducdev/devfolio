import {
  CAREER_SECTIONS,
  INFINITE_SCROLL_CONFIG,
  RUNNER_CONFIG,
} from "@/config/career-timeline";

const SECTION_WIDTH = RUNNER_CONFIG.sectionWidth;
const SPACER_WIDTH = RUNNER_CONFIG.spacerWidth;
const LOOP_CONNECTOR_WIDTH = SECTION_WIDTH / 2;
const SECTION_COUNT = CAREER_SECTIONS.length;
const PADDING_END = RUNNER_CONFIG.paddingEnd;

export function getLeadingCloneWidth(): number {
  const sectionCloneWidth =
    INFINITE_SCROLL_CONFIG.leadingCloneSections * SECTION_WIDTH;
  const loopConnector = INFINITE_SCROLL_CONFIG.includeLoopConnectorInClone
    ? LOOP_CONNECTOR_WIDTH
    : 0;
  return sectionCloneWidth + loopConnector + SPACER_WIDTH;
}

export function getRealContentWidth(): number {
  return (
    SPACER_WIDTH +
    SECTION_COUNT * SECTION_WIDTH +
    LOOP_CONNECTOR_WIDTH +
    PADDING_END
  );
}

export function getRealContentStartPos(): number {
  return getLeadingCloneWidth();
}

export function normalizeScrollPosition(scrollLeft: number): {
  normalizedScroll: number;
  needsTeleport: boolean;
  teleportTo: number | null;
} {
  const leadingCloneWidth = getLeadingCloneWidth();
  const realContentWidth = getRealContentWidth();
  const threshold = INFINITE_SCROLL_CONFIG.teleportThreshold;

  const relativePos = scrollLeft - leadingCloneWidth;

  if (scrollLeft < threshold) {
    const distanceIntoClone = leadingCloneWidth - scrollLeft;
    const teleportTo = leadingCloneWidth + realContentWidth - distanceIntoClone;
    return {
      normalizedScroll: realContentWidth - distanceIntoClone,
      needsTeleport: true,
      teleportTo,
    };
  }

  const trailingCloneStart = leadingCloneWidth + realContentWidth;
  if (scrollLeft > trailingCloneStart + threshold) {
    const distanceIntoClone = scrollLeft - trailingCloneStart;
    const teleportTo = leadingCloneWidth + distanceIntoClone;
    return {
      normalizedScroll: distanceIntoClone,
      needsTeleport: true,
      teleportTo,
    };
  }

  const clampedNormalized = Math.max(
    0,
    Math.min(realContentWidth, relativePos)
  );
  return {
    normalizedScroll: clampedNormalized,
    needsTeleport: false,
    teleportTo: null,
  };
}

export function calculateSectionIndex(scrollLeft: number): number {
  const { normalizedScroll } = normalizeScrollPosition(scrollLeft);

  const positionInSections = normalizedScroll - SPACER_WIDTH;
  if (positionInSections < 0) {
    return 0;
  }

  const rawIndex = Math.floor(positionInSections / SECTION_WIDTH);
  return Math.min(Math.max(0, rawIndex), SECTION_COUNT - 1);
}
