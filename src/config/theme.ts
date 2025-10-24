export const THEMES = [
  {
    name: "Default",
    value: "default",
  },
  {
    name: "Bubblegum",
    value: "bubblegum",
  },
  {
    name: "Mocha Mousse",
    value: "mocha-mousse",
  },
  {
    name: "Dark Matter",
    value: "dark-matter",
  },
];

export type Theme = (typeof THEMES)[number];
