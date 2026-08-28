#!/usr/bin/env node

/**
 * @file Adds a comment to PRs with details of what test results changed.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import zlib from 'node:zlib';

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

const playgroundParam = (css) =>
  zlib.deflateSync(Buffer.from(css, 'utf-8'), { level: 9 }).toString('base64');

const playgroundUrl = async (testPath) => {
  const [source, expected] = await Promise.all([
    readTestFile(testPath, 'source.css'),
    readTestFile(testPath, 'expected.css')
  ]);
  if (!source) {
    return '';
  }
  const params = new URLSearchParams({ v: playgroundParam(source) });
  if (expected) {
    params.set('x', playgroundParam(expected));
  }
  return `https://thejaredwilcurt.com/playground/?${params}`;
};

const mdTable = (columns) => {
  const headers = Object.keys(columns);
  const rows = Object.values(columns)[0].length;
  return [
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...Array.from(
      { length: rows },
      (_, i) => `| ${headers.map((h) => columns[h][i]).join(' | ')} |`
    )
  ].join('\n');
};

const minifierLabel = (m) => (newMinifiers.includes(m) ? `✨ ${m}` : m);

const passIcon = (val) => (val === null ? 'N/A' : val ? '✅' : '❌');

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
      .filter((m) => !newMinifiers.includes(m))
      .some((m) => (
        (beforeMinifierResults[m] ?? null) !==
        (afterMinifierResults[m] ?? null)
      ));
    if (changed) {
      changedTests.push(testPath);
    }
  }
}

const existingMinifiers = minifiers.filter((m) => !newMinifiers.includes(m));
const beforeTotals = totals(beforeResults, existingMinifiers);
const afterTotals = totals(afterResults);

const totalDiff = existingMinifiers.reduce((s, m) => {
  return s + (afterTotals[m]?.pass ?? 0) - (beforeTotals[m]?.pass ?? 0);
}, 0);

const lines = ['<!-- pr-comment-results -->', ''];

const hasChanges =
  newTests.length > 0 || changedTests.length > 0 || newMinifiers.length > 0;

if (!hasChanges) {
  lines.push('_No new or changed tests or minifiers._');
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
      [...newTests, ...changedTests].map(
        async (t) => [t, await playgroundUrl(t)]
      )
    )
  );
  const testLabel = (t) => (
    playgroundUrls[t] ? `[\`${t}\`](${playgroundUrls[t]})` : `\`${t}\``
  );

  if (newTests.length > 0) {
    const count = newTests.length;
    lines.push(`**${count} new ${'test'.plural(count)} added:**`, '');
    for (const testPath of newTests) {
      const readme = await readTestFile(testPath, 'README.md');
      const firstLine = readme.split('\n')[0].replace(/^#+\s*/, '');
      lines.push(
        `- ${testLabel(testPath)}${firstLine ? ` - ${firstLine}` : ''}`
      );
    }
    lines.push('');
  }

  if (changedTests.length > 0) {
    const count = changedTests.length;
    lines.push(`**${count} ${'test'.plural(count)} changed.**`, '');
  }

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
      '### New Tests',
      '',
      mdTable({
        test: newTests.map(testLabel),
        ...Object.fromEntries(
          minifiers.map((m) => [
            minifierLabel(m),
            newTests.map((t) => passIcon(afterResults[t][m] ?? null))
          ])
        )
      })
    );
  }

  if (changedTests.length > 0) {
    lines.push(
      '',
      '### Changed Tests',
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
      })
    );
  }
}

console.log(lines.join('\n'));
