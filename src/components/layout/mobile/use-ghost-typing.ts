import { useRef, useState } from "react";
import { useUnmount } from "usehooks-ts";

import { useMobileShellActions } from "@/components/layout/mobile/store";

export const useGhostTyping = () => {
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { setCurrentCommand } = useMobileShellActions();

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const type = (command: string) => {
    cancel();

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
        setCurrentCommand(command);
      }
    };

    timeoutRef.current = setTimeout(typeNext, charDelay);
  };

  useUnmount(cleanup);

  return { isTyping, text, type };
};
