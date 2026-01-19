import { ClientOnly } from "@tanstack/react-router";
import { cn } from "@/lib/utils.ts";
import { useCareerLooping, useCharacterAnimationState } from "@/store/career";
import { CHARACTER_CONFIG } from "./config";
import RiveCharacter from "./rive-character";

export default function Character() {
  const careerLooping = useCareerLooping();
  const animationState = useCharacterAnimationState();

  return (
    <div
      className={cn(
        "transition-transform",
        careerLooping ? "rotate-y-180" : ""
      )}
      style={{
        width: CHARACTER_CONFIG.size.width,
        height: CHARACTER_CONFIG.size.height,
        aspectRatio: `${CHARACTER_CONFIG.size.width} / ${CHARACTER_CONFIG.size.height}`,
      }}
    >
      <ClientOnly fallback={null}>
        <RiveCharacter animationState={animationState} />
      </ClientOnly>
    </div>
  );
}
