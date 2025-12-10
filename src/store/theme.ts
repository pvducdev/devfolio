import { create } from "zustand";
import { persist } from "zustand/middleware";
import { THEME_STORAGE_KEY, THEMES, type Theme } from "@/config/theme.ts";

type State = {
  theme: Theme["value"];
};

type Actions = {
  setTheme: (v: Theme["value"]) => void;
};

export const useThemeStore = create<State & Actions>()(
  persist(
    (set) => ({
      theme: THEMES.find((t) => t.value === "default")?.value || "",
      setTheme: (theme) => {
        set({ theme });
      },
    }),
    {
      name: THEME_STORAGE_KEY,
    }
  )
);

export const useCurrentTheme = () => useThemeStore((s) => s.theme);

export const useSetTheme = () => useThemeStore((s) => s.setTheme);
