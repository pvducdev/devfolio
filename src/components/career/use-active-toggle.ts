import { useState } from "react";

export const useActiveToggle = (isActive: boolean) => {
  const [isToggled, setIsToggled] = useState(false);
  const [wasActive, setWasActive] = useState(isActive);

  if (wasActive !== isActive) {
    setWasActive(isActive);
    if (!isActive) {
      setIsToggled(false);
    }
  }

  return { isToggled, toggle: () => setIsToggled((toggled) => !toggled) };
};
