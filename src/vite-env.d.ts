declare const __APP_VERSION__: string;

declare module "*.wasm" {
  const src: string;
  export default src;
}

declare global {
  // biome-ignore lint/style/useConsistentTypeDefinitions: Interface required for Window declaration merging
  interface Window {
    __loadThemeFonts?: (theme: string) => void;
  }
}
