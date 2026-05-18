#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";

String.prototype.plural = function (c) {
  return c === 1 ? `${this}` : `${this}s`;
};

const readReadme = async (testPath) => {
  try {
    return (
      await fs.readFile(path.join("tests", testPath, "README.md"), "utf-8")
    ).trim();
  } catch {
    return "";
  }
};

const mdTable = (columns) => {
  const headers = Object.keys(columns);
  const rows = Object.values(columns)[0].length;
  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...Array.from(
      { length: rows },
      (_, i) => `| ${headers.map((h) => columns[h][i]).join(" | ")} |`,
    ),
  ].join("\n");
};

const minifierLabel = (m) => (newMinifiers.includes(m) ? `✨ ${m}` : m);

const passIcon = (val) => (val === null ? "N/A" : val ? "✅" : "❌");

const totals = (results, includedMinifiers = null) => {
  const counts = {};
  for (const minifierResults of Object.values(results)) {
    for (const [m, pass] of Object.entries(minifierResults)) {
      if (includedMinifiers && !includedMinifiers.includes(m)) continue;
      if (!counts[m]) counts[m] = { pass: 0, total: 0 };
      if (pass !== null) {
        counts[m].total++;
        if (pass) counts[m].pass++;
      }
    }
  }
  return counts;
};

let [, , beforeResultsPath] = process.argv;
if (!beforeResultsPath) {
  console.error("Usage: node lib/pr-comment.js <before-results.json>");
  process.exit(1);
}

const [beforeResults, afterResults] = await Promise.all([
  fs.readFile(beforeResultsPath, "utf-8").then(JSON.parse),
  fs.readFile("results.json", "utf-8").then(JSON.parse),
]);

const beforeMinifiers = new Set(
  Object.keys(Object.values(beforeResults)[0] ?? {}),
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
      .some(
        (m) =>
          (beforeMinifierResults[m] ?? null) !==
          (afterMinifierResults[m] ?? null),
      );
    if (changed) changedTests.push(testPath);
  }
}

const existingMinifiers = minifiers.filter((m) => !newMinifiers.includes(m));
const beforeTotals = totals(beforeResults, existingMinifiers);
const afterTotals = totals(afterResults);

const totalDiff = existingMinifiers.reduce(
  (s, m) => s + (afterTotals[m]?.pass ?? 0) - (beforeTotals[m]?.pass ?? 0),
  0,
);

const lines = ["<!-- pr-comment-results -->", ""];

const hasChanges =
  newTests.length > 0 || changedTests.length > 0 || newMinifiers.length > 0;

if (!hasChanges) {
  lines.push("_No new or changed tests or minifiers._");
} else {
  if (newMinifiers.length > 0) {
    const names = newMinifiers.map((m) => `\`${m}\``).join(", ");
    lines.push(
      `✨ **New ${"minifier".plural(newMinifiers.length)} added:** ${names}`,
      "",
    );
  }

  if (newTests.length > 0) {
    const count = newTests.length;
    lines.push(`**${count} new ${"test".plural(count)} added:**`, "");
    for (const testPath of newTests) {
      const readme = await readReadme(testPath);
      const firstLine = readme.split("\n")[0].replace(/^#+\s*/, "");
      lines.push(`- \`${testPath}\`${firstLine ? ` — ${firstLine}` : ""}`);
    }
    lines.push("");
  }

  if (changedTests.length > 0) {
    const count = changedTests.length;
    lines.push(`**${count} ${"test".plural(count)} changed.**`, "");
  }

  const changeSummary =
    totalDiff > 0
      ? `↑\uFE0F ${totalDiff} more ${"test".plural(totalDiff)} passing across existing minifiers.`
      : totalDiff < 0
        ? `↓\uFE0F ${Math.abs(totalDiff)} fewer ${"test".plural(Math.abs(totalDiff))} passing across existing minifiers.`
        : "↔\uFE0F No change in passing tests across existing minifiers.";
  lines.push(`**Results:** ${changeSummary}`, "");

  lines.push(
    mdTable({
      Minifier: minifiers.map(minifierLabel),
      Before: minifiers.map((m) => {
        if (newMinifiers.includes(m)) return "—";
        const b = beforeTotals[m] ?? { pass: 0, total: 0 };
        return `${b.pass}/${b.total}`;
      }),
      After: minifiers.map((m) => {
        const a = afterTotals[m] ?? { pass: 0, total: 0 };
        return `${a.pass}/${a.total}`;
      }),
      Change: minifiers.map((m) => {
        if (newMinifiers.includes(m)) return "✨ new";
        const b = beforeTotals[m] ?? { pass: 0, total: 0 };
        const a = afterTotals[m] ?? { pass: 0, total: 0 };
        const diff = a.pass - b.pass;
        return diff > 0 ? `⬆️ +${diff}` : diff < 0 ? `⬇️ ${diff}` : `↔️ 0`;
      }),
    }),
  );

  if (newTests.length > 0) {
    lines.push(
      "",
      "### New Tests",
      "",
      mdTable({
        test: newTests.map((t) => `\`${t}\``),
        ...Object.fromEntries(
          minifiers.map((m) => [
            minifierLabel(m),
            newTests.map((t) => passIcon(afterResults[t][m] ?? null)),
          ]),
        ),
      }),
    );
  }

  if (changedTests.length > 0) {
    const beforeRows = changedTests.map((t) => `\`${t}\` before`);
    const afterRows = changedTests.map((t) => `\`${t}\` after`);
    const allRows = beforeRows.flatMap((b, i) => [b, afterRows[i]]);
    lines.push(
      "",
      "### Changed Tests",
      "",
      mdTable({
        test: allRows,
        ...Object.fromEntries(
          minifiers.map((m) => [
            minifierLabel(m),
            changedTests.flatMap((t) => [
              passIcon(beforeResults[t][m] ?? null),
              passIcon(afterResults[t][m] ?? null),
            ]),
          ]),
        ),
      }),
    );
  }
}

console.log(lines.join("\n"));
