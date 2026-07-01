/**
 * @file Copies all the real world files from the node_modules to the
 *       `/minifed/originals` folder for use on the website.
 */
import {
  cpSync,
  rmSync
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

  rmSync(destination, { recursive: true, force: true });
  cpSync(source, destination, { recursive: true });
};
