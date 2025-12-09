import { create } from "zustand";
import { persist } from "zustand/middleware";
import { THEMES, type Theme } from "@/config/theme.ts";

const STORE_KEY = "theme";

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
      name: STORE_KEY,
    }
  )
);

export const useCurrentTheme = () => useThemeStore((s) => s.theme);

export const useSetTheme = () => useThemeStore((s) => s.setTheme);
