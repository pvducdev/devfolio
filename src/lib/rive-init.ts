import riveWASMResource from "@rive-app/canvas/rive.wasm";
// biome-ignore lint/performance/noNamespaceImport: <rive bundler is not common js>
import * as Rive from "@rive-app/react-canvas";

if (typeof window !== "undefined") {
  const { RuntimeLoader } = Rive;
  RuntimeLoader.setWasmUrl(riveWASMResource);
}
