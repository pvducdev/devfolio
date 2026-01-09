import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import getRepoStarsFn from "@/fn/get-repo-stars";
import { useMount } from "@/hooks/use-mount";

export function useRepoStars() {
  const [stars, setStars] = useState<number>(0);
  const getRepoStars = useServerFn(getRepoStarsFn);

  useMount(async () => {
    const result = await getRepoStars();
    setStars(result ?? 0);
  });

  return stars;
}
