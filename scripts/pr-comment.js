#!/usr/bin/env node

/**
 * @file Adds a comment to PRs with details of what test results changed.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import zlib from 'node:zlib';

import { registry } from '../lib/loaders/loadAllMinifiers.js';

String.prototype.plural = function (c) {
  return c === 1 ? `${this}` : `${this}s`;
};

const readTestFile = async (testPath, name) => {
  try {
    return (
      await fs.readFile(path.join('tests', testPath, name), 'utf-8')
    ).trim();
  } catch {
    return '';
  }
};

const readAlternates = async (testPath) => {
  let names;
  try {
    names = await fs.readdir(path.join('tests', testPath));
  } catch {
    return [];
  }
  names = names
    .filter((name) => {
      return (
        name !== 'expected.css' &&
        name.startsWith('expected.') &&
        name.endsWith('.css')
      );
    })
    .sort();
  return Promise.all(names.map((name) => readTestFile(testPath, name)));
};

const playgroundParam = (css) => {
  return zlib
    .deflateSync(Buffer.from(css, 'utf-8'), { level: 9 })
    .toString('base64');
};

const testCssCache = new Map();

const loadTestCss = (testPath) => {
  if (!testCssCache.has(testPath)) {
    testCssCache.set(
      testPath,
      Promise.all([
        readTestFile(testPath, 'source.css'),
        readTestFile(testPath, 'expected.css'),
        readAlternates(testPath)
      ])
    );
  }
  return testCssCache.get(testPath);
};

const playgroundUrl = async (testPath) => {
  const [source, expected] = await loadTestCss(testPath);
  if (!source) {
    return '';
  }
  const params = new URLSearchParams({ v: playgroundParam(source) });
  if (expected) {
    params.set('x', playgroundParam(expected));
  }
  return `https://TheJaredWilcurt.com/playground/?${params}`;
};

const testDetails = async (testPaths) => {
  const blocks = [];
  for (const testPath of testPaths) {
    const [source, expected, alternates] = await loadTestCss(testPath);
    if (!source) {
      continue;
    }
    console.log({ [testPath]: afterResults[testPath] });
    blocks.push(
      '',
      '<details>',
      `<summary><code>${testPath}</code></summary>`,
      '',
      '**Source**',
      '',
      '```css',
      source,
      '```',
      '',
      '**Expected**',
      '',
      '```css',
      expected,
      '```'
    );
    for (const alternate of alternates) {
      blocks.push(
        '',
        '**Also accepted**',
        '',
        '```css',
        alternate,
        '```'
      );
    }
    for (const minifier in afterResults[testPath]) {
      if (
        beforeResults[testPath]?.[minifier] &&
        !afterResults[testPath][minifier]
      ) {
        let result = await registry[minifier].minify(source);
        blocks.push(
          '',
          '**Changed:** (' + minifier + ')',
          '',
          '```css',
          result,
          '```'
        );
      }
    }
    blocks.push('', '</details>');
  }
  return blocks;
};

const mdTable = (columns) => {
  const headers = Object.keys(columns);
  const rows = Object.values(columns)[0].length;
  return [
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => ':--').join(' | ')} |`,
    ...Array.from(
      { length: rows },
      (_, i) => `| ${headers.map((h) => columns[h][i]).join(' | ')} |`
    )
  ].join('\n');
};

const minifierLabel = (minifier) => {
  if (newMinifiers.includes(minifier)) {
    minifier = '✨ ' + minifier;
  }
  return minifier;
};

const passIcon = (value) => {
  if (value === null) {
    return 'N/A';
  }
  if (value) {
    return '✅';
  }
  return '❌';
};

const totals = (results, includedMinifiers = null) => {
  const counts = {};
  for (const minifierResults of Object.values(results)) {
    for (const [m, pass] of Object.entries(minifierResults)) {
      if (includedMinifiers && !includedMinifiers.includes(m)) {
        continue;
      }
      if (!counts[m]) {
        counts[m] = { pass: 0, total: 0 };
      }
      if (pass !== null) {
        counts[m].total++;
        if (pass) {
          counts[m].pass++;
        }
      }
    }
  }
  return counts;
};

let [, , beforeResultsPath, afterResultsPath = 'data/results.json'] = process.argv;
if (!beforeResultsPath) {
  console.error('Usage: node scripts/pr-comment.js <before-results.json> [after-results.json]');
  process.exit(1);
}

const [beforeResults, afterResults] = await Promise.all([
  fs.readFile(beforeResultsPath, 'utf-8').then(JSON.parse),
  fs.readFile(afterResultsPath, 'utf-8').then(JSON.parse)
]);

const beforeMinifiers = new Set(
  Object.keys(Object.values(beforeResults)[0] ?? {})
);
const afterMinifiers = Object.keys(Object.values(afterResults)[0]);
const newMinifiers = afterMinifiers.filter((m) => !beforeMinifiers.has(m));
const minifiers = afterMinifiers;

const newTests = [];
const changedTests = [];

for (const [testPath, afterMinifierResults] of Object.entries(afterResults)) {
  if (!(testPath in beforeResults)) {
    newTests.push(testPath);
  } else {
    const beforeMinifierResults = beforeResults[testPath];
    const changed = minifiers
      .filter((minifier) => {
        return !newMinifiers.includes(minifier);
      })
      .some((minifier) => {
        return (
          (beforeMinifierResults[minifier] ?? null) !==
          (afterMinifierResults[minifier] ?? null)
        );
      });
    if (changed) {
      changedTests.push(testPath);
    }
  }
}

const existingMinifiers = minifiers.filter((m) => !newMinifiers.includes(m));
const beforeTotals = totals(beforeResults, existingMinifiers);
const afterTotals = totals(afterResults);

const totalDiff = existingMinifiers.reduce((total, minifier) => {
  return (
    total +
    (afterTotals[minifier]?.pass ?? 0) -
    (beforeTotals[minifier]?.pass ?? 0)
  );
}, 0);

const lines = ['<!-- pr-comment-results -->', ''];

const hasChanges = (
  newTests.length > 0 ||
  changedTests.length > 0 ||
  newMinifiers.length > 0
);

if (!hasChanges) {
  lines.push('*No new or changed tests or minifiers.*');
} else {
  if (newMinifiers.length > 0) {
    const names = newMinifiers.map((m) => `\`${m}\``).join(', ');
    lines.push(
      `✨ **New ${'minifier'.plural(newMinifiers.length)} added:** ${names}`,
      ''
    );
  }

  const playgroundUrls = Object.fromEntries(
    await Promise.all(
      [
        ...newTests,
        ...changedTests
      ]
        .map(async (test) => [test, await playgroundUrl(test)])
    )
  );
  const testLabel = (t) => (
    playgroundUrls[t] ? `[\`${t}\`](${playgroundUrls[t]})` : `\`${t}\``
  );

  const changeSummary =
    totalDiff > 0 ?
      `↑\uFE0F ${totalDiff} more ${'test'.plural(totalDiff)} passing across existing minifiers.` :
      totalDiff < 0 ?
        `↓\uFE0F ${Math.abs(totalDiff)} fewer ${'test'.plural(Math.abs(totalDiff))} passing across existing minifiers.` :
        '↔\uFE0F No change in passing tests across existing minifiers.';
  lines.push(`**Results:** ${changeSummary}`, '');

  lines.push(
    mdTable({
      Minifier: minifiers.map(minifierLabel),
      Before: minifiers.map((m) => {
        if (newMinifiers.includes(m)) {
          return '—';
        }
        const b = beforeTotals[m] ?? { pass: 0, total: 0 };
        return `${b.pass}/${b.total}`;
      }),
      After: minifiers.map((m) => {
        const a = afterTotals[m] ?? { pass: 0, total: 0 };
        return `${a.pass}/${a.total}`;
      }),
      Change: minifiers.map((m) => {
        if (newMinifiers.includes(m)) {
          return '✨ new';
        }
        const b = beforeTotals[m] ?? { pass: 0, total: 0 };
        const a = afterTotals[m] ?? { pass: 0, total: 0 };
        const diff = a.pass - b.pass;
        return diff > 0 ? `⬆️ +${diff}` : diff < 0 ? `⬇️ ${diff}` : '↔️ 0';
      })
    })
  );

  if (newTests.length > 0) {
    lines.push(
      '',
      '### New Tests (' + newTests.length + ')',
      '',
      mdTable({
        test: newTests.map(testLabel),
        ...Object.fromEntries(
          minifiers.map((m) => [
            minifierLabel(m),
            newTests.map((t) => passIcon(afterResults[t][m] ?? null))
          ])
        )
      }),
      ...(await testDetails(newTests))
    );
  }

  if (changedTests.length > 0) {
    lines.push(
      '',
      '### Changed Tests (' + changedTests.length + ')',
      '',
      mdTable({
        test: changedTests.map(testLabel),
        ...Object.fromEntries(
          minifiers.map((m) => [
            minifierLabel(m),
            changedTests.map((t) => {
              const after = passIcon(afterResults[t][m] ?? null);
              if (newMinifiers.includes(m)) {
                return after;
              }
              const before = passIcon(beforeResults[t][m] ?? null);
              return before === after ? after : `${before} ➡️ ${after}`;
            })
          ])
        )
      }),
      ...(await testDetails(changedTests))
    );
  }
}

console.log(lines.join('\n'));
