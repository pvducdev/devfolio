import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";

import getRepoStarsFn from "@/components/layout/get-repo-stars";
import { getLogger } from "@/lib/logger";

export const useRepoStars = (): number | null => {
  const [stars, setStars] = useState<number | null>(null);
  const getRepoStars = useServerFn(getRepoStarsFn);

  useEffect(() => {
    const loadStars = async () => {
      try {
        setStars(await getRepoStars());
      } catch (error) {
        await getLogger().error("Failed to fetch repository stars", {
          error: error instanceof Error ? error.message : String(error),
        });
      }
    };

    loadStars();
  }, [getRepoStars]);

  return stars;
};
