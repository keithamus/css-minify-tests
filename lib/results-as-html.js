import fs from "node:fs/promises";

export async function resultsAsHTML(testResults, versions, htmlFilePath) {
  let totalScores = "";
  for (const minifier in testResults.minifiers) {
    const results = testResults.minifiers[minifier];
    const isPerfect = results.pass === results.checks;
    const cellClass = isPerfect
      ? "pass"
      : results.pass === 0
        ? "fail"
        : "partial";

    totalScores += html`<td class="${cellClass}">
      ${results.pass} / ${results.checks}
    </td>`;
  }

  let content = html`<section>
    <h2>Summary</h2>

    <div style="margin-bottom: 64px;">
      <table>
        ${thead(["", ...Object.keys(testResults.minifiers)], versions)}
        <tbody>
          <tr>
            <td><strong>Total</strong></td>
            ${totalScores}
          </tr>
        </tbody>
      </table>
    </div>

    ${table(testResults, true)}
  </section>`;

  for (const test in testResults.tests) {
    content += html`<section id="${test}">
      <h2>${test}</h2>
      ${table(testResults.tests[test], false)}
    </section>`;
  }

  await fs.writeFile(htmlFilePath, page(content));
}

function table(testResults, isSummary = true) {
  let rows = "";
  const minifierNames = Object.keys(testResults.minifiers);
  const colCount = 1 + minifierNames.length;

  for (const test in testResults.tests) {
    let row = "";
    const testId = test.replace("/", "-");
    if (isSummary) {
      row = html`<td><a href="#${test}">${test}</a></td>`;
    } else {
      const testNum = test.split("/").pop();
      row = html`<td>
        <a href="#${testId}"><code>${testNum}</code></a>
      </td>`;
    }

    const subResults = testResults.tests[test];
    for (const minifier in subResults.minifiers) {
      const minifierResult = subResults.minifiers[minifier];
      const cellClass =
        minifierResult.pass === minifierResult.checks
          ? "pass"
          : minifierResult.pass === 0
            ? "fail"
            : "partial";

      if (minifierResult.error) {
        row += html`<td class="error" title="${minifierResult.error}">ERR</td>`;
      } else if (minifierResult.na) {
        row += html`<td class="na">N/A</td>`;
      } else if (!isSummary && minifierResult.checks === 1) {
        const match = minifierResult.pass === minifierResult.checks;
        row += html`<td class="${cellClass}">
          <span class="${match ? "pass" : "fail"}-icon"
            >${match ? "&#10003;" : "&#10007;"}</span
          >
        </td>`;
      } else {
        row += html`<td class="${cellClass}">
          ${minifierResult.pass} / ${minifierResult.checks}
        </td>`;
      }
    }

    rows += isSummary
      ? html`<tr>
          ${row}
        </tr>`
      : html`<tr id="${testId}">
          ${row}
        </tr>`;

    if (!isSummary) {
      rows += detailRow(test, subResults, minifierNames, colCount);
    }
  }

  let subtotalCells = "";
  for (const minifier in testResults.minifiers) {
    const results = testResults.minifiers[minifier];
    const cellClass =
      results.pass === results.checks
        ? "pass"
        : results.pass === 0
          ? "fail"
          : "partial";
    subtotalCells += html`<td class="${cellClass}">
      ${results.pass} / ${results.checks}
    </td>`;
  }

  if (isSummary) {
    return html`<table>
      ${thead(["test", ...Object.keys(testResults.minifiers)])}
      <tbody>
        ${rows}
      </tbody>
      <tfoot>
        <tr>
          <td><strong>Subtotal</strong></td>
          ${subtotalCells}
        </tr>
      </tfoot>
    </table> `;
  }

  const tableId = `table-${Object.keys(testResults.tests)[0].split("/")[0]}`;
  return html`<button commandfor="${tableId}" command="--expand">
      Expand all
    </button>
    <table id="${tableId}">
      ${thead(["test", ...Object.keys(testResults.minifiers)])}
      <tbody>
        ${rows}
      </tbody>
      <tfoot>
        <tr>
          <td><strong>Subtotal</strong></td>
          ${subtotalCells}
        </tr>
      </tfoot>
    </table> `;
}

function escapeHTML(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function detailRow(test, subResults, minifierNames, colCount) {
  const readme = subResults.readme
    ? html`<p>
        ${escapeHTML(subResults.readme.replace(/^#[^\n]*\n*/, "").trim())}
      </p>`
    : "";

  let outputs = "";
  for (const name of minifierNames) {
    const r = subResults.minifiers[name];
    if (r.na) continue;
    if (r.error) {
      outputs += html`<div>
        <h4>${name}</h4>
        <pre class="detail-error"><code>${escapeHTML(r.error)}</code></pre>
      </div>`;
    } else if (r.actual != null) {
      const match = r.pass === r.checks;
      outputs += html`<div>
        <h4>
          ${name}
          <span class="${match ? "pass" : "fail"}-icon"
            >${match ? "&#10003;" : "&#10007;"}</span
          >
        </h4>
        <pre><code>${escapeHTML(r.actual)}</code></pre>
      </div>`;
    }
  }

  const validate = subResults.validate
    ? html`<div>
        <h4>Validate</h4>
        <iframe
          src="data:text/html;base64,${Buffer.from(
            subResults.validate,
          ).toString("base64")}"
          sandbox="allow-same-origin"
          loading="lazy"
        ></iframe>
      </div>`
    : "";

  return html`<tr>
    <td colspan="${colCount}">
      <details>
        <summary>Details</summary>
        ${readme}
        <div>
          <h4>Source</h4>
          <pre><code>${escapeHTML(subResults.source)}</code></pre>
        </div>
        <div>
          <h4>Expected</h4>
          <pre><code>${escapeHTML(subResults.expected)}</code></pre>
        </div>
        ${validate}
        <div>
          <h4>Outputs</h4>
          <div
            class="detail-outputs"
            style="margin-left:${(1 / colCount) *
            100}%;grid-template-columns:repeat(${minifierNames.length},1fr)"
          >
            ${outputs}
          </div>
        </div>
      </details>
    </td>
  </tr>`;
}

function thead(headings, versions) {
  let versionRow = "";
  if (versions) {
    versionRow = html`<tr class="version-row">
      ${headings
        .map((h, i) => {
          if (i === 0) return html`<td></td>`;
          const v = versions[h];
          return html`<td>${v ? `v${v}` : ""}</td>`;
        })
        .join("")}
    </tr>`;
  }
  return html`<thead>
    <tr>
      ${headings.map((h) => (h ? html`<th>${h}</th>` : "<td></td>")).join("")}
    </tr>
    ${versionRow}
  </thead>`;
}

function page(body) {
  return html`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>CSS Minify Tests</title>
        <link rel="stylesheet" href="style.css" />
      </head>
      <body>
        <main id="results">
          <h1>CSS Minify Tests</h1>

          <p>
            Correctness tests for CSS minification tools. Each test provides a
            CSS input and a single canonical minified output. A tool passes if
            its output matches exactly.
          </p>

          <button commandfor="results" command="--expand">Expand all</button>

          ${body}
        </main>
        <script src="script.js"></script>
      </body>
    </html> `;
}

export function html(strings, ...values) {
  return String.raw({ raw: strings }, ...values);
}
