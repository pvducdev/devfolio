import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useShallow } from "zustand/shallow";

import { STORE_KEYS } from "@/config/store-keys";

export type AssistantStatus = "idle" | "thinking" | "streaming" | "error";

interface AssistantState {
  message: string | null;
  status: AssistantStatus;
  error: string | null;
}

interface AssistantActions {
  setMessage: (content: string) => void;
  setStatus: (status: Exclude<AssistantStatus, "error">) => void;
  setError: (error: string) => void;
  setChunkMessage: (chunk: string) => void;
  clear: () => void;
}

type AssistantStore = AssistantState & AssistantActions;

const initialState: AssistantState = {
  error: null,
  message: null,
  status: "idle",
};

const useAssistantStore = create<AssistantStore>()(
  persist(
    (set) => ({
      ...initialState,

      clear: () => set(initialState),

      setChunkMessage: (chunk) =>
        set((state) => ({
          message: (state.message ?? "") + chunk,
          status: state.status === "thinking" ? "streaming" : state.status,
        })),

      setError: (error) => set({ error, status: "error" }),

      setMessage: (content) =>
        set({ error: null, message: content, status: "idle" }),

      setStatus: (status) => set({ error: null, status }),
    }),
    {
      name: STORE_KEYS.ASSISTANT,
      partialize: (state) =>
        state.status === "idle" || state.status === "error"
          ? { message: state.message }
          : {},
    }
  )
);

export const useAssistantStatus = () => useAssistantStore((s) => s.status);

export const useAssistantError = () => useAssistantStore((s) => s.error);

export const useHasAssistantMessage = () =>
  useAssistantStore((s) => s.message !== null);

export const useAssistantMessage = () => useAssistantStore((s) => s.message);

export const useAssistantActions = () =>
  useAssistantStore(
    useShallow((s) => ({
      clear: s.clear,
      setChunkMessage: s.setChunkMessage,
      setError: s.setError,
      setMessage: s.setMessage,
      setStatus: s.setStatus,
    }))
  );
