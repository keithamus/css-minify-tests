/**
 * @file Copies all the real world files from the node_modules to the
 *       `/minifed/originals` folder for use on the website.
 */
import {
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync
} from 'node:fs';
import { join } from 'node:path';

const __dirname = import.meta.dirname;

/**
 * Copies all the real world files from the node_modules to the
 * `/minifed/originals` folder for use on the website.
 */
export const copyOriginalRealWorldFiles = function () {
  const root = join(__dirname, '..', '..',);
  const node_modules = join(root, 'node_modules');
  const source = join(node_modules, 'real-world-css-libraries', 'libs');
  const destination = join(root, 'minified', 'originals');
  mkdirSync(destination, { recursive: true });

  const allFiles = readdirSync(source);
  for (const fileName of allFiles) {
    const file = join(source, fileName);
    const contents = readFileSync(file);
    writeFileSync(join(destination, fileName), String(contents));
  }
};
