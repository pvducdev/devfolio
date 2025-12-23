import { createIsomorphicFn } from "@tanstack/react-start";

const MAC_PLATFORM_REGEX = "Mac";

export const isMac = createIsomorphicFn()
  .server(() => false)
  .client(() => navigator.userAgent.includes(MAC_PLATFORM_REGEX));
