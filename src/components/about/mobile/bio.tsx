import { PERSONAL_INFO } from "@/config/personal-info";
import { mobile_about_bio_label } from "@/paraglide/messages";

export default function AboutBio() {
  return (
    <div className="mt-6">
      <p className="text-muted-foreground text-xs">
        {mobile_about_bio_label()}
      </p>
      <p className="mt-1 text-foreground text-sm">{PERSONAL_INFO.bio}</p>
    </div>
  );
}
