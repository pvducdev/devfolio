export const startViewTransition = (action: () => void): void => {
  if (document.startViewTransition) {
    document.startViewTransition(action);
  } else {
    action();
  }
};
