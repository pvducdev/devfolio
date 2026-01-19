export async function initRive() {
  const [{ default: riveWASMResource }, Rive] = await Promise.all([
    import("@rive-app/canvas/rive.wasm?url"),
    import("@rive-app/react-canvas"),
  ]);

  Rive.RuntimeLoader.setWasmUrl(riveWASMResource);
}

if (typeof window !== "undefined") {
  initRive();
}
