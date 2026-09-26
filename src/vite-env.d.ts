declare const __APP_VERSION__: string;

declare module "*.wasm" {
  const src: string;
  export default src;
}
