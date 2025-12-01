import { create } from "zustand";
import { persist } from "zustand/middleware";

const STORE_KEY = "assistant";

type AssistantState = {
  message: string | null;
  isStreaming: boolean;
  error: string | null;
};

type AssistantActions = {
  setResponse: (content: string) => void;
  startStreaming: () => void;
  appendChunk: (chunk: string) => void;
  finishStreaming: () => void;
  setError: (error: string) => void;
  clear: () => void;
};

type AssistantStore = AssistantState & AssistantActions;

const initialState: AssistantState = {
  message: null,
  isStreaming: false,
  error: null,
};

export const useAssistantStore = create<AssistantStore>()(
  persist(
    (set) => ({
      ...initialState,

      setResponse: (content) =>
        set({ message: content, isStreaming: false, error: null }),

      startStreaming: () =>
        set({ message: "", isStreaming: true, error: null }),

      appendChunk: (chunk) =>
        set((state) => ({ message: (state.message ?? "") + chunk })),

      finishStreaming: () => set({ isStreaming: false }),

      setError: (error) => set({ error, isStreaming: false }),

      clear: () => set(initialState),
    }),
    {
      name: STORE_KEY,
      partialize: (state) => ({ message: state.message }),
    }
  )
);
