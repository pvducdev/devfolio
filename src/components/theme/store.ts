import { create } from "zustand";
import { persist } from "zustand/middleware";

import { DEFAULT_THEME, THEME_STORAGE_KEY } from "@/config/theme";
import type { ThemeValue } from "@/config/theme";

interface State {
  theme: ThemeValue;
}

interface Actions {
  setTheme: (theme: ThemeValue) => void;
}

const useThemeStore = create<State & Actions>()(
  persist(
    (set) => ({
      setTheme: (theme) => {
        set({ theme });
        window.__loadThemeFonts?.(theme);
      },
      theme: DEFAULT_THEME,
    }),
    {
      name: THEME_STORAGE_KEY,
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);

export const useCurrentTheme = () => useThemeStore((s) => s.theme);

export const useSetTheme = () => useThemeStore((s) => s.setTheme);
