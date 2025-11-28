import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ResponseType = "immediate" | "streaming";

export type AssistantMessage = {
  content: string;
  type: ResponseType;
  timestamp: number;
};

type AssistantState = {
  message: AssistantMessage | null;
  isStreaming: boolean;
  error: string | null;
};

type AssistantActions = {
  setImmediateResponse: (content: string) => void;
  startStreamingResponse: () => void;
  appendChunk: (chunk: string) => void;
  finishStreamingResponse: () => void;
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

      setImmediateResponse: (content) =>
        set({
          message: {
            content,
            type: "immediate",
            timestamp: Date.now(),
          },
          isStreaming: false,
          error: null,
        }),

      startStreamingResponse: () =>
        set({
          message: {
            content: "",
            type: "streaming",
            timestamp: Date.now(),
          },
          isStreaming: true,
          error: null,
        }),

      appendChunk: (chunk) =>
        set((state) => ({
          message: state.message
            ? { ...state.message, content: state.message.content + chunk }
            : null,
        })),

      finishStreamingResponse: () =>
        set({
          isStreaming: false,
        }),

      setError: (error) =>
        set({
          error,
          isStreaming: false,
        }),

      clear: () => set(initialState),
    }),
    {
      name: "assistant-storage",
      partialize: (state) => ({
        message: state.message,
      }),
    }
  )
);
