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
  setStatus: (status: AssistantStatus, error?: AssistantState["error"]) => void;
  setChunkMessage: (chunk: string) => void;
  clear: () => void;
}

type AssistantStore = AssistantState & AssistantActions;

const initialState: AssistantState = {
  error: null,
  message: null,
  status: "idle",
};

export const useAssistantStore = create<AssistantStore>()(
  persist(
    (set) => ({
      ...initialState,

      clear: () => set(initialState),

      setChunkMessage: (chunk) =>
        set((state) => ({
          message: (state.message ?? "") + chunk,
          status: state.status === "thinking" ? "streaming" : state.status,
        })),

      setMessage: (content) =>
        set({ error: null, message: content, status: "idle" }),

      setStatus: (status, error) => set({ error, status }),
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
      setMessage: s.setMessage,
      setStatus: s.setStatus,
    }))
  );
