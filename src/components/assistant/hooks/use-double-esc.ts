import { useRef } from "react";

export function useDoubleEsc(onClear: () => void, threshold = 1000) {
  const lastEscPressRef = useRef<number>(0);

  return () => {
    const now = Date.now();
    const timeSinceLastPress = now - lastEscPressRef.current;

    if (timeSinceLastPress < threshold) {
      onClear();
      lastEscPressRef.current = 0;
      return;
    }

    lastEscPressRef.current = now;
  };
}
