import fs from "node:fs/promises";
import path from "node:path";
import { minify, minifiers, getVersions } from "./lib/minify.js";
import { resultsAsHTML } from "./lib/results-as-html.js";
import { appendHistory } from "./lib/history.js";
import { traverseDir } from "./lib/traverse-dir.js";

const debugMode = !!process.env.DEBUG;

const testGroups = new Map();
const testsSeen = new Set();
const testFiles = new Set(await traverseDir("./tests"));

for (const testFile of testFiles) {
  const testFileParsed = path.parse(testFile);
  const testDirParsed = path.parse(testFileParsed.dir);
  const testGroupName = testDirParsed.dir.split(path.sep).pop();
  const test = path.join(testGroupName, testDirParsed.base);

  if (testsSeen.has(test)) {
    continue;
  }
  testsSeen.add(test);

  const hasSource = testFiles.has(path.join(testFileParsed.dir, "source.css"));
  const hasExpected = testFiles.has(
    path.join(testFileParsed.dir, "expected.css"),
  );

  if (hasSource && hasExpected) {
    const testGroup = testGroups.get(testGroupName) ?? {
      name: testGroupName,
      tests: [],
    };

    testGroup.tests.push(test);
    testGroups.set(testGroupName, testGroup);
  }
}

const sortedGroups = [...testGroups.values()].sort((a, b) =>
  a.name.localeCompare(b.name),
);
for (const group of sortedGroups) {
  group.tests.sort();
}

const results = {
  tests: {},
  minifiers: {},
};

const debugInfo = [];

for (const minifierName of minifiers) {
  let minifierPasses = 0;
  let minifierChecks = 0;

  for (const testGroup of sortedGroups) {
    results.tests[testGroup.name] = results.tests[testGroup.name] ?? {
      tests: {},
      minifiers: {},
    };

    results.tests[testGroup.name].minifiers[minifierName] = results.tests[
      testGroup.name
    ].minifiers[minifierName] ?? {
      checks: 0,
      pass: 0,
    };

    for (const testPath of testGroup.tests) {
      if (!results.tests[testGroup.name].tests[testPath]) {
        const source = await fs.readFile(
          path.join("tests", testPath, "source.css"),
          "utf-8",
        );
        const expected = (
          await fs.readFile(
            path.join("tests", testPath, "expected.css"),
            "utf-8",
          )
        ).replace(/\n$/, "");
        let readme = "";
        try {
          readme = await fs.readFile(
            path.join("tests", testPath, "README.md"),
            "utf-8",
          );
        } catch {}
        let validate = "";
        try {
          validate = await fs.readFile(
            path.join("tests", testPath, "validate.html"),
            "utf-8",
          );
        } catch {}
        results.tests[testGroup.name].tests[testPath] = {
          minifiers: {},
          source,
          expected,
          readme,
          validate,
        };
      }

      const source = results.tests[testGroup.name].tests[testPath].source;
      const expected = results.tests[testGroup.name].tests[testPath].expected;

      let actual;
      let error = null;

      try {
        actual = await minify(minifierName, source);
      } catch (err) {
        error = err.message || String(err);
        actual = null;
      }

      const checks = 1;
      let pass = 0;

      if (error) {
        results.tests[testGroup.name].tests[testPath].minifiers[minifierName] =
          {
            checks,
            pass: 0,
            error,
          };
        results.tests[testGroup.name].minifiers[minifierName].checks += checks;
        minifierChecks += checks;
        continue;
      }

      if (actual === null) {
        results.tests[testGroup.name].tests[testPath].minifiers[minifierName] =
          {
            checks: 0,
            pass: 0,
            na: true,
          };
        results.tests[testGroup.name].minifiers[minifierName].na = true;
        continue;
      }

      const normalizedActual = actual.replace(/\n$/, "");

      if (normalizedActual === expected) {
        pass = 1;
      } else if (debugMode) {
        debugInfo.push({
          minifier: minifierName,
          test: testPath,
          expected,
          actual: normalizedActual,
        });
      }

      results.tests[testGroup.name].tests[testPath].minifiers[minifierName] = {
        checks,
        pass,
        actual: normalizedActual,
      };

      results.tests[testGroup.name].minifiers[minifierName].checks += checks;
      results.tests[testGroup.name].minifiers[minifierName].pass += pass;

      minifierPasses += pass;
      minifierChecks += checks;
    }
  }

  results.minifiers[minifierName] = {
    checks: minifierChecks,
    pass: minifierPasses,
  };
}

console.log("\nCSS Minify Tests\n");

const colWidth = 14;
const testColWidth = 16;

function pad(str, width) {
  return String(str).padEnd(width);
}

function padCenter(str, width) {
  const s = String(str);
  const left = Math.floor((width - s.length) / 2);
  return (
    " ".repeat(Math.max(0, left)) +
    s +
    " ".repeat(Math.max(0, width - s.length - left))
  );
}

process.stdout.write(pad("", testColWidth));
for (const m of minifiers) {
  process.stdout.write(padCenter(m, colWidth));
}
console.log();

process.stdout.write(pad("", testColWidth));
for (const m of minifiers) {
  process.stdout.write(padCenter("─".repeat(m.length + 2), colWidth));
}
console.log();

process.stdout.write(pad("TOTAL", testColWidth));
for (const m of minifiers) {
  const r = results.minifiers[m];
  process.stdout.write(padCenter(`${r.pass} / ${r.checks}`, colWidth));
}
console.log();
console.log();

for (const group of sortedGroups) {
  process.stdout.write(pad(group.name, testColWidth));
  for (const m of minifiers) {
    const r = results.tests[group.name].minifiers[m];
    if (r.na) {
      process.stdout.write(padCenter("N/A", colWidth));
    } else {
      process.stdout.write(padCenter(`${r.pass}/${r.checks}`, colWidth));
    }
  }
  console.log();
}

console.log();

if (debugInfo.length > 0) {
  console.log("Mismatches:\n");
  for (const info of debugInfo) {
    console.log(`  ${info.minifier} | ${info.test}`);
    console.log(`    expected: ${JSON.stringify(info.expected)}`);
    console.log(`    actual:   ${JSON.stringify(info.actual)}`);
    console.log();
  }
}

const versions = getVersions(minifiers);
const history = await appendHistory(results, versions);
await resultsAsHTML(results, versions, history, "index.html");
console.log("HTML report written to index.html");
