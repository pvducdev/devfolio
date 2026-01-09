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
  message: null,
  status: "idle",
  error: null,
};

export const useAssistantStore = create<AssistantStore>()(
  persist(
    (set) => ({
      ...initialState,

      setMessage: (content) =>
        set({ message: content, status: "idle", error: null }),

      setStatus: (status, error) => set({ status, error }),

      setChunkMessage: (chunk) =>
        set((state) => ({
          message: (state.message ?? "") + chunk,
          status: state.status === "thinking" ? "streaming" : state.status,
        })),

      clear: () => set(initialState),
    }),
    {
      name: STORE_KEYS.ASSISTANT,
      partialize: (state) => ({ message: state.message }),
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
      setMessage: s.setMessage,
      setChunkMessage: s.setChunkMessage,
      setStatus: s.setStatus,
      clear: s.clear,
    }))
  );
