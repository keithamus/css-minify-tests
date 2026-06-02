import fs from "node:fs";
import path from "node:path";
import cleanCss from "./minifiers/clean-css.js";
import csslop from "./minifiers/csslop.js";
import csskit from "./minifiers/csskit.js";
import cssnano from "./minifiers/cssnano.js";
import csso from "./minifiers/csso.js";
import esbuild from "./minifiers/esbuild.js";
import lightningcss from "./minifiers/lightningcss.js";
import sass from "./minifiers/sass.js";

const registry = new Map([
  ["clean-css", cleanCss],
  ["csskit", csskit],
  ["csslop", csslop],
  ["cssnano", cssnano],
  ["csso", csso],
  ["esbuild", esbuild],
  ["lightningcss", lightningcss],
  ["sass", sass],
]);

export const minifiers = [...registry.keys()];

export async function minify(name, source) {
  const fn = registry.get(name);
  if (!fn) throw new Error(`Unknown minifier: ${name}`);
  return fn(source);
}

export function getVersions(names = minifiers) {
  const versions = {};
  const scopedPackages = {
    csslop: "@thejaredwilcurt"
  };
  for (let name of names) {
    const pathParts = [
      import.meta.dirname,
      "..",
      "node_modules"
    ];
    if (scopedPackages[name]) {
      pathParts.push(scopedPackages[name]);
    }
    pathParts.push(name);
    pathParts.push("package.json");
    try {
      const pkgPath = path.resolve(...pathParts);
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
      versions[name] = pkg.version;
    } catch {
      versions[name] = null;
    }
  }
  return versions;
}
