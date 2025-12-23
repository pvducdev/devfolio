import { create } from "zustand";
import { persist } from "zustand/middleware";
import { THEME_STORAGE_KEY, THEMES, type Theme } from "@/config/theme.ts";
import { isFunction } from "@/lib/utils.ts";

interface State {
  theme: Theme["value"];
}

interface Actions {
  setTheme: (v: Theme["value"]) => void;
}

export const useThemeStore = create<State & Actions>()(
  persist(
    (set) => ({
      theme: THEMES.find((t) => t.value === "default")?.value || "",
      setTheme: (theme) => {
        set({ theme });
        if (
          typeof window !== "undefined" &&
          // @ts-expect-error
          isFunction(window.__loadThemeFonts)
        ) {
          // @ts-expect-error
          window.__loadThemeFonts(theme);
        }
      },
    }),
    {
      name: THEME_STORAGE_KEY,
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);

export const useCurrentTheme = () => useThemeStore((s) => s.theme);

export const useSetTheme = () => useThemeStore((s) => s.setTheme);
