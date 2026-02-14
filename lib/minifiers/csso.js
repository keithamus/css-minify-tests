import { minify as cssoMinify } from "csso";

export default function minify(source) {
  return cssoMinify(source).css;
}
