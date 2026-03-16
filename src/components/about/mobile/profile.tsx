import { PERSONAL_INFO } from "@/config/personal-info";

export default function AboutProfile() {
  return (
    <div className="flex items-center gap-4">
      <img
        alt={PERSONAL_INFO.name}
        className="size-20 rounded-full grayscale"
        height={80}
        src={PERSONAL_INFO.avatar}
        width={80}
      />
      <div>
        <p className="font-bold text-base text-foreground">
          {PERSONAL_INFO.name}
        </p>
        <p className="text-muted-foreground text-xs">
          Loc: {PERSONAL_INFO.location}
        </p>
      </div>
    </div>
  );
}
