import { transform } from "esbuild";

export default async function minify(source) {
  const { code } = await transform(source, {
    loader: "css",
    minify: true,
    target: ["chrome130", "firefox130", "safari18"],
  });
  return code;
}
