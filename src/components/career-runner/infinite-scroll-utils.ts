import {
  CAREER_SECTIONS,
  INFINITE_SCROLL_CONFIG,
  RUNNER_CONFIG,
} from "@/config/career-timeline";

const SECTION_WIDTH = RUNNER_CONFIG.sectionWidth;
const SPACER_WIDTH = 140;
const LOOP_CONNECTOR_WIDTH = SECTION_WIDTH / 2; // 500px
const SECTION_COUNT = CAREER_SECTIONS.length;
const PADDING_END = 200;

/**
 * Calculate the width of the leading clone zone.
 * Structure: [Last N sections] + [LoopConnector] + [Spacer]
 */
export function getLeadingCloneWidth(): number {
  const sectionCloneWidth =
    INFINITE_SCROLL_CONFIG.leadingCloneSections * SECTION_WIDTH;
  const loopConnector = INFINITE_SCROLL_CONFIG.includeLoopConnectorInClone
    ? LOOP_CONNECTOR_WIDTH
    : 0;
  return sectionCloneWidth + loopConnector + SPACER_WIDTH;
}

/**
 * Calculate the width of the trailing clone zone.
 * Structure: [Spacer] + [First N sections]
 */
export function getTrailingCloneWidth(): number {
  const sectionCloneWidth =
    INFINITE_SCROLL_CONFIG.trailingCloneSections * SECTION_WIDTH;
  return SPACER_WIDTH + sectionCloneWidth;
}

/**
 * Calculate the real content width (original layout).
 * Structure: [Spacer] + [All sections] + [LoopConnector] + [Padding]
 */
export function getRealContentWidth(): number {
  return (
    SPACER_WIDTH +
    SECTION_COUNT * SECTION_WIDTH +
    LOOP_CONNECTOR_WIDTH +
    PADDING_END
  );
}

/**
 * Get the scroll position that corresponds to the start of real content.
 * This is where we initialize the scroll position on mount.
 */
export function getRealContentStartPos(): number {
  return getLeadingCloneWidth();
}

/**
 * Normalize a scroll position to the equivalent position in real content zone
 * and determine if teleport is needed.
 *
 * Returns:
 * - normalizedScroll: Position relative to real content start (0 = start of spacer)
 * - needsTeleport: Whether we should teleport to avoid being in clone zone
 * - teleportTo: The absolute scroll position to teleport to (if needed)
 */
export function normalizeScrollPosition(scrollLeft: number): {
  normalizedScroll: number;
  needsTeleport: boolean;
  teleportTo: number | null;
} {
  const leadingCloneWidth = getLeadingCloneWidth();
  const realContentWidth = getRealContentWidth();
  const threshold = INFINITE_SCROLL_CONFIG.teleportThreshold;

  // Position relative to real content start
  const relativePos = scrollLeft - leadingCloneWidth;

  // Case 1: Deep in leading clone zone (scrolling backward past start)
  if (scrollLeft < threshold) {
    // User scrolled far back into clone of end sections
    // Teleport to equivalent position in real content (near end)
    const distanceIntoClone = leadingCloneWidth - scrollLeft;
    const teleportTo = leadingCloneWidth + realContentWidth - distanceIntoClone;
    return {
      normalizedScroll: realContentWidth - distanceIntoClone,
      needsTeleport: true,
      teleportTo,
    };
  }

  // Case 2: Deep in trailing clone zone (scrolling forward past end)
  const trailingCloneStart = leadingCloneWidth + realContentWidth;
  if (scrollLeft > trailingCloneStart + threshold) {
    // User scrolled far into clone of start sections
    // Teleport to equivalent position in real content (near start)
    const distanceIntoClone = scrollLeft - trailingCloneStart;
    const teleportTo = leadingCloneWidth + distanceIntoClone;
    return {
      normalizedScroll: distanceIntoClone,
      needsTeleport: true,
      teleportTo,
    };
  }

  // Case 3: In real content zone or buffer zone (no teleport needed)
  // Clamp the normalized scroll for calculations
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

/**
 * Calculate section index from any scroll position.
 * Returns 0 to (SECTION_COUNT-1) regardless of whether in clone or real zone.
 */
export function calculateSectionIndex(scrollLeft: number): number {
  const { normalizedScroll } = normalizeScrollPosition(scrollLeft);

  // Account for spacer at the start of real content
  const positionInSections = normalizedScroll - SPACER_WIDTH;
  if (positionInSections < 0) {
    return 0;
  }

  const rawIndex = Math.floor(positionInSections / SECTION_WIDTH);
  return Math.min(Math.max(0, rawIndex), SECTION_COUNT - 1);
}
