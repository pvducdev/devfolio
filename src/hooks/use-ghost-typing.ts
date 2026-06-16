import { useRef, useState } from "react";
import { useUnmount } from "usehooks-ts";

import { useMobileShellStore } from "@/store/mobile-shell";

interface UseGhostTypingReturn {
  text: string;
  isTyping: boolean;
  type: (command: string, onComplete?: () => void) => void;
  cancel: () => void;
}

export const useGhostTyping = (): UseGhostTypingReturn => {
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onCompleteRef = useRef<(() => void) | undefined>();

  const cleanup = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const cancel = () => {
    cleanup();
    setIsTyping(false);
  };

  const type = (command: string, onComplete?: () => void) => {
    cancel();

    onCompleteRef.current = onComplete;
    setText("");
    setIsTyping(true);

    const charDelay = Math.max(30, Math.min(50, 400 / command.length));
    let charIndex = 0;

    const typeNext = () => {
      if (timeoutRef.current === null) {
        return;
      }

      if (charIndex < command.length) {
        charIndex += 1;
        setText(command.slice(0, charIndex));
        timeoutRef.current = setTimeout(typeNext, charDelay);
      } else {
        setIsTyping(false);
        useMobileShellStore.getState().setCurrentCommand(command);
        onCompleteRef.current?.();
      }
    };

    timeoutRef.current = setTimeout(typeNext, charDelay);
  };

  useUnmount(cleanup);

  return { cancel, isTyping, text, type };
};
