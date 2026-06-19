import { minify as wasmMinify } from "csskit";

export default function minify(source) {
  return wasmMinify(source);
}
