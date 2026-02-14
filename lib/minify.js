import fs from "node:fs";
import path from "node:path";
import cleanCss from "./minifiers/clean-css.js";
import csskit from "./minifiers/csskit.js";
import cssnano from "./minifiers/cssnano.js";
import csso from "./minifiers/csso.js";
import esbuild from "./minifiers/esbuild.js";
import lightningcss from "./minifiers/lightningcss.js";

const registry = new Map([
  ["clean-css", cleanCss],
  ["csskit", csskit],
  ["cssnano", cssnano],
  ["csso", csso],
  ["esbuild", esbuild],
  ["lightningcss", lightningcss],
]);

export const minifiers = [...registry.keys()];

export async function minify(name, source) {
  const fn = registry.get(name);
  if (!fn) throw new Error(`Unknown minifier: ${name}`);
  return fn(source);
}

export function getVersions(names = minifiers) {
  const versions = {};
  for (const name of names) {
    try {
      const pkgPath = path.resolve(
        import.meta.dirname,
        "..",
        "node_modules",
        name,
        "package.json",
      );
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
      versions[name] = pkg.version;
    } catch {
      versions[name] = null;
    }
  }
  return versions;
}
