/// <reference types="vite-plugin-svgr/client" />

declare const __APP_VERSION__: string;

declare module "*.wasm" {
  const src: string;
  export default src;
}

declare global {
  interface Window {
    __loadThemeFonts?: (theme: string) => void;
  }
}
