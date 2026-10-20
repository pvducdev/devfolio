import { useState } from "react";

export const useCollapsed = (isActive: boolean) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [wasActive, setWasActive] = useState(isActive);

  if (wasActive !== isActive) {
    setWasActive(isActive);
    if (!isActive) {
      setIsCollapsed(false);
    }
  }

  return {
    isCollapsed,
    toggleCollapsed: () => setIsCollapsed((collapsed) => !collapsed),
  };
};
