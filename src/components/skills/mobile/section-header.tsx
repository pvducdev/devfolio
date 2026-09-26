import { SKILL_SECTIONS } from "../sections";
import type { SkillSectionId } from "../sections";

interface SectionHeaderProps {
  section: SkillSectionId;
}

export default function SectionHeader({ section }: SectionHeaderProps) {
  const { number, title } = SKILL_SECTIONS[section];

  return (
    <div className="flex items-baseline gap-3 border-border border-b pb-2">
      <span className="font-mono text-muted-foreground/50 text-sm tracking-widest">
        {number}
      </span>
      <span className="font-bold text-muted-foreground text-xs uppercase tracking-wider">
        {title()}
      </span>
    </div>
  );
}
