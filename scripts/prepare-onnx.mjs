import { createRequire } from "node:module";
import { readdir, mkdir, copyFile } from "node:fs/promises";
import path from "node:path";
const require = createRequire(import.meta.url);
const dist = path.dirname(require.resolve("onnxruntime-web"));
const output = path.resolve("public/onnx");
await mkdir(output, { recursive: true });
const files = (await readdir(dist)).filter(
  (name) => name.startsWith("ort-wasm-simd-threaded") && /\.(wasm|mjs)$/.test(name),
);
if (!files.some((name) => name.endsWith(".wasm"))) throw new Error("ONNX runtime files not found");
for (const name of files) await copyFile(path.join(dist, name), path.join(output, name));
console.log(`Prepared ${files.length} local ONNX runtime files`);
