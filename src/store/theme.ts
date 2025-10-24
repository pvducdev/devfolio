import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Theme } from "@/config/theme.ts";
import applyTheme from "@/lib/applyTheme.ts";

export const storeKey = "theme";

type State = {
  theme: Theme["value"];
};

type Actions = {
  setTheme: (v: Theme["value"]) => void;
};

export const useThemeStore = create<State & Actions>()(
  persist(
    (set) => ({
      theme: "",
      setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
      },
    }),
    {
      name: storeKey,
    }
  )
);
