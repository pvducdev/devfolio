import {
  skills_section_core,
  skills_section_devops,
  skills_section_exploring,
  skills_section_stack,
  skills_section_standards,
  skills_section_workflow,
  skills_standards_a11y,
  skills_standards_best_practices,
  skills_standards_performance,
} from "@/paraglide/messages";

export const SKILL_SECTIONS = {
  core: { number: "01", title: skills_section_core },
  devops: { number: "03", title: skills_section_devops },
  exploring: { number: "06", title: skills_section_exploring },
  stack: { number: "02", title: skills_section_stack },
  standards: { number: "04", title: skills_section_standards },
  workflow: { number: "05", title: skills_section_workflow },
} as const;

export type SkillSectionId = keyof typeof SKILL_SECTIONS;

export const STANDARD_CARDS = [
  { key: "performance", label: skills_standards_performance },
  { key: "accessibility", label: skills_standards_a11y },
  { key: "bestPractices", label: skills_standards_best_practices },
] as const;

export const TEXT_LOOP_ANIMATION = {
  transition: {
    damping: 80,
    mass: 10,
    stiffness: 900,
    type: "spring",
  },
  variants: {
    animate: { filter: "blur(0px)", opacity: 1, rotateX: 0, y: 0 },
    exit: { filter: "blur(4px)", opacity: 0, rotateX: -90, y: -20 },
    initial: { filter: "blur(4px)", opacity: 0, rotateX: 90, y: 20 },
  },
} as const;
