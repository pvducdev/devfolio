import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useShallow } from "zustand/shallow";
import { STORE_KEYS } from "@/config/store-keys";

export type AssistantStatus = "idle" | "thinking" | "streaming";

interface AssistantState {
  message: string | null;
  status: AssistantStatus;
  error: string | null;
}

interface AssistantActions {
  setResponse: (content: string) => void;
  setMessage: (content: string) => void;
  setThinking: () => void;
  setStreaming: () => void;
  setIdle: () => void;
  appendChunk: (chunk: string) => void;
  setError: (error: string) => void;
  clearError: () => void;
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

      setResponse: (content) =>
        set({ message: content, status: "idle", error: null }),

      setMessage: (content) => set({ message: content }),

      setThinking: () => set({ status: "thinking", message: "", error: null }),

      setStreaming: () => set({ status: "streaming" }),

      setIdle: () => set({ status: "idle" }),

      appendChunk: (chunk) =>
        set((state) => ({
          message: (state.message ?? "") + chunk,
          status: state.status === "thinking" ? "streaming" : state.status,
        })),

      setError: (error) => set({ error, status: "idle" }),

      clearError: () => set({ error: null }),

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
      setResponse: s.setResponse,
      setMessage: s.setMessage,
      setThinking: s.setThinking,
      setStreaming: s.setStreaming,
      setIdle: s.setIdle,
      appendChunk: s.appendChunk,
      setError: s.setError,
      clearError: s.clearError,
      clear: s.clear,
    }))
  );
