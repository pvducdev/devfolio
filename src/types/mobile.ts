export interface DockButton {
  id: string;
  label: () => string;
  command: string;
  route?: string;
  action?: "back" | "resume" | "contact" | "live" | "next" | "linkedin";
  listing?: string;
}

export interface DockConfig {
  buttons: DockButton[];
}
