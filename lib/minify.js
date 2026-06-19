import { registry } from './loaders/loadAllMinifiers.js';

export async function minify (name, source) {
  const fn = registry.get(name);
  if (!fn) throw new Error(`Unknown minifier: ${name}`);
  const output = await fn(source);
  return output.trim();
}
