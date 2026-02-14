import { execSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

let bin;

const PLATFORM_PACKAGES = {
  "linux-x64": "csskit-linux-x64",
  "linux-arm64": "csskit-linux-arm64",
  "darwin-x64": "csskit-darwin-x64",
  "darwin-arm64": "csskit-darwin-arm64",
  "win32-x64": "csskit-win32-x64",
  "win32-arm64": "csskit-win32-arm64",
};

function findBin() {
  if (bin !== undefined) return bin;

  const nodeModules = path.resolve(
    import.meta.dirname,
    "..",
    "..",
    "node_modules",
  );

  // Try the .bin symlink first (works when npm links it correctly)
  const npmBin = path.join(nodeModules, ".bin", "csskit");
  try {
    execSync(`"${npmBin}" --version`, { stdio: "pipe" });
    bin = npmBin;
    return bin;
  } catch {}

  // Resolve platform binary directly (npm sometimes skips creating .bin links)
  const key = `${os.platform()}-${os.arch()}`;
  const pkg = PLATFORM_PACKAGES[key];
  if (pkg) {
    const platformBin = path.join(
      nodeModules,
      pkg,
      "bin",
      os.platform() === "win32" ? "csskit.exe" : "csskit",
    );
    if (fs.existsSync(platformBin)) {
      bin = platformBin;
      return bin;
    }
  }

  // Fall back to PATH
  try {
    execSync("csskit --version", { stdio: "pipe" });
    bin = "csskit";
    return bin;
  } catch {
    bin = null;
    return bin;
  }
}

export default function minify(source) {
  const resolved = findBin();
  if (!resolved) return null;

  return execSync(`"${resolved}" min -`, {
    input: source,
    encoding: "utf-8",
    stdio: ["pipe", "pipe", "pipe"],
  });
}
