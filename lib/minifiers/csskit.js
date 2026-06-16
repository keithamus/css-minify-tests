import { execSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const __dirname = import.meta.dirname;

let bin;

function findBin () {
  const PLATFORM_PACKAGES = {
    'linux-x64': 'csskit-linux-x64',
    'linux-arm64': 'csskit-linux-arm64',
    'darwin-x64': 'csskit-darwin-x64',
    'darwin-arm64': 'csskit-darwin-arm64',
    'win32-x64': 'csskit-win32-x64',
    'win32-arm64': 'csskit-win32-arm64'
  };
  if (bin !== undefined) {
    return;
  };

  const nodeModules = path.resolve(__dirname, '..', '..', 'node_modules');

  // Try the .bin symlink first (works when npm links it correctly)
  const npmBin = path.join(nodeModules, '.bin', 'csskit');
  try {
    execSync(npmBin + ' --version', { stdio: 'pipe' });
    bin = npmBin;
    return;
  } catch {}

  // Resolve platform binary directly (npm sometimes skips creating .bin links)
  const key = os.platform() + '-' + os.arch();
  const pkg = PLATFORM_PACKAGES[key];
  let file = 'csskit';
  if (os.platform() === 'win32') {
    file = 'csskit.exe';
  }
  if (pkg) {
    const platformBin = path.join(nodeModules, pkg, 'bin', file);
    if (fs.existsSync(platformBin)) {
      bin = platformBin;
      return;
    }
  }

  // Fall back to PATH
  try {
    execSync('csskit --version', { stdio: 'pipe' });
    bin = 'csskit';
    return;
  } catch {
    bin = null;
    return;
  }
}
findBin();

export default function minify (source) {
  if (!bin) {
    return null
  };

  return execSync(`"${bin}" min -`, {
    input: source,
    encoding: 'utf-8',
    stdio: ['pipe', 'pipe', 'pipe']
  });
}
