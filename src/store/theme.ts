import { create } from "zustand";
import { persist } from "zustand/middleware";

import { THEME_STORAGE_KEY, THEMES } from "@/config/theme";
import type { Theme } from "@/config/theme";

interface State {
  theme: Theme["value"];
}

interface Actions {
  setTheme: (v: Theme["value"]) => void;
}

export const useThemeStore = create<State & Actions>()(
  persist(
    (set) => ({
      setTheme: (theme) => {
        set({ theme });
        if (
          typeof window !== "undefined" &&
          typeof window.__loadThemeFonts === "function"
        ) {
          window.__loadThemeFonts(theme);
        }
      },
      theme: THEMES.find((t) => t.value === "default")?.value || "",
    }),
    {
      name: THEME_STORAGE_KEY,
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);

export const useCurrentTheme = () => useThemeStore((s) => s.theme);

export const useSetTheme = () => useThemeStore((s) => s.setTheme);
