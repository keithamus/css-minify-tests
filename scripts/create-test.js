import { execSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  readdirSync,
  writeFileSync
} from 'node:fs';
import { join } from 'node:path';

const __dirname = import.meta.dirname;

const testCategory = process.argv[2];

if (!testCategory) {
  console.error('Usage: npm run new-test -- <test-category>');
  process.exit(1);
}

const testsPath = join(__dirname, '..', 'tests', testCategory);

let nextNumber = 1;

if (existsSync(testsPath)) {
  const entries = readdirSync(testsPath);
  if (entries.length > 0) {
    const numbers = entries
      .map((entry) => {
        return parseInt(entry, 10);
      })
      .filter((number) => {
        return !isNaN(number);
      })
      .sort((a, b) => {
        return a - b
      });

    if (numbers.length > 0) {
      nextNumber = numbers[numbers.length - 1] + 1;
    }
  }
}

const testPath = join(testsPath, String(nextNumber).padStart(4, '0'));
mkdirSync(testPath, { recursive: true });

const files = ['source.css', 'expected.css', 'README.md'];
files.forEach((file) => {
  if (file === 'README.md') {
    writeFileSync(join(testPath, file), '# \n');
  } else {
    writeFileSync(join(testPath, file), '');
  }
});

console.log('Created ' + testPath);

// Open files in editor
const editor = process.env.EDITOR || 'vim';
const filesToEdit = files
  .map((file) => {
    return join(testPath, file);
  })
  .join(' ');

try {
  execSync(editor + ' ' + filesToEdit, { stdio: 'inherit' });
} catch (error) {
  // Editor was closed or encountered an error
  console.log('Editor closed.');
}
