export const THEMES = [
  {
    name: "Notebook (default)",
    value: "default",
  },
  {
    name: "Bubblegum",
    value: "bubblegum",
  },
  {
    name: "Dark Twitter",
    value: "twitter",
  },
  {
    name: "Mocha Mousse",
    value: "mocha-mousse",
  },
];

export type Theme = (typeof THEMES)[number];
