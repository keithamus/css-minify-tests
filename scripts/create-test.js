/**
 * @file Creates a new 4-digit numerical test folder with dummy files, then
 *       opens those files in your editor. Use `npm config edit` to set your
 *       editor of choice.
 */

import { execSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  readdirSync,
  writeFileSync
} from 'node:fs';
import { join } from 'node:path';

const __dirname = import.meta.dirname;

/**
 * Creates a new numerical test folder and files, then opens them in your
 * editor.
 */
function createNewTest () {
  function getTestsPathFromCLIArguments () {
    const testCategory = process.argv[2];
    if (!testCategory) {
      console.error('Usage: npm run new-test -- <test-category>');
      process.exit(1);
    }
    const testsPath = join(__dirname, '..', 'tests', testCategory);
    return testsPath;
  }

  function getNextNumber (testsPath) {
    let nextNumber = 1;
    if (existsSync(testsPath)) {
      const folderNames = readdirSync(testsPath);
      if (folderNames.length) {
        const numbers = folderNames
          .map((entry) => {
            return parseInt(entry, 10);
          })
          .filter((number) => {
            return !isNaN(number);
          })
          .sort((a, b) => {
            return a - b;
          });

        if (numbers.length) {
          nextNumber = numbers[numbers.length - 1] + 1;
        }
      }
    }
    return nextNumber;
  }

  function createNewTestFolder (testsPath, nextNumber) {
    const newFolderName = String(nextNumber).padStart(4, '0');
    const testPath = join(testsPath, newFolderName);
    mkdirSync(testPath, { recursive: true });
    return testPath;
  }

  function createTestFiles (testPath, files) {
    files.forEach((file) => {
      if (file === 'README.md') {
        writeFileSync(join(testPath, file), '# \n');
      } else {
        writeFileSync(join(testPath, file), '');
      }
    });
    console.log('Created ' + testPath);
  }

  function openFilesInEditor (testPath, files) {
    const editor = process.env.EDITOR || 'vim';
    const filesToEdit = files
      .map((file) => {
        return join(testPath, file);
      })
      .join(' ');

    try {
      execSync(editor + ' ' + filesToEdit, { stdio: 'inherit' });
    } catch {
      console.log('Editor was closed (or encountered an error).');
    }
  }

  const testsPath = getTestsPathFromCLIArguments();
  const nextNumber = getNextNumber(testsPath);
  const testPath = createNewTestFolder(testsPath, nextNumber);
  const files = ['source.css', 'expected.css', 'README.md'];
  createTestFiles(testPath, files);
  openFilesInEditor(testPath, files);
}

createNewTest();
