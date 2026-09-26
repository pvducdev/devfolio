import { cn } from "cn";

import { CHARACTER_CONFIG } from "../config";
import { useCareerLooping } from "../store";
import { useCharacterRive } from "../use-character-rive";

export default function Character() {
  const careerLooping = useCareerLooping();
  const RiveComponent = useCharacterRive();

  return (
    <div
      className={cn(
        "transition-transform",
        careerLooping ? "rotate-y-180" : ""
      )}
      style={{
        aspectRatio: `${CHARACTER_CONFIG.size.width} / ${CHARACTER_CONFIG.size.height}`,
        height: CHARACTER_CONFIG.size.height,
        width: CHARACTER_CONFIG.size.width,
      }}
    >
      <RiveComponent />
    </div>
  );
}
