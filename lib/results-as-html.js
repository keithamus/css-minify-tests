import fs from 'node:fs/promises';

import { marked } from 'marked';
import { codeToHtml } from 'shiki';

import { makeRealWorldTable } from './createWebsite/makeRealWorldTable.js';
import { minifiers } from './loaders/loadAllMinifiers.js';
import { formatMs } from './helpers.js';

const CHECKMARK = '&#10003;'; // ✓
const CROSS_MARK = '&#10007;'; // ✗

function html (strings, ...values) {
  return String.raw({ raw: strings }, ...values);
}

function thead (headings, versions) {
  let versionRow = '';
  if (versions) {
    const header = headings
      .map((heading, index) => {
        if (index === 0) {
          return html`<td></td>`
        };
        const versionNumber = versions[heading];
        const version = versionNumber ? 'v' + versionNumber : '';
        return html`<td>${version}</td>`;
      })
      .join('');
    versionRow = html`<tr class="version-row">
      ${header}
    </tr>`;
  }
  const headers = headings
    .map((heading) => {
      if (heading) {
        return html`<th>${heading}</th>`
      }
      return '<td></td>';
    })
    .join('');
  return html`<thead>
    <tr>
      ${headers}
    </tr>
    ${versionRow}
  </thead>`;
}

async function detailRow (test, subResults, minifierNames, colCount) {
  // Themes can be previewed at:
  // https://textmate-grammars-themes.netlify.app/?theme=dark-plus&grammar=css
  const shikiOptions = {
    lang: 'css',
    theme: 'dark-plus'
  };

  const readme = subResults.readme
    ? html`<p>
        ${marked.parse(subResults.readme)}
      </p>`
    : '';

  let outputs = '';
  for (const name of minifierNames) {
    const r = subResults.minifiers[name];
    if (r.na) continue;
    if (r.error) {
      let errorMarkup = await codeToHtml(r.error, shikiOptions);
      const preClass = '<pre class="';
      if (errorMarkup.startsWith(preClass)) {
        errorMarkup = errorMarkup.replace(preClass,  preClass + 'detail-error ');
      }
      outputs += html`<div class="detail-fail">
        <h4>${name} <span class="fail-icon">${CROSS_MARK}</span></h4>
        ${errorMarkup}
      </div>`;
    } else if (r.actual != null) {
      const match = r.pass === r.checks;
      const actualMarkup = await codeToHtml(r.actual, shikiOptions);
      outputs += html`<div class="detail-${match ? 'pass' : 'fail'}">
        <h4>
          ${name}
          <span class="${match ? 'pass' : 'fail'}-icon"
            >${match ? CHECKMARK : CROSS_MARK}</span
          >
        </h4>
        ${actualMarkup}
      </div>`;
    }
  }

  const validate = subResults.validate
    ? html`<div>
        <h4>Validate</h4>
        <iframe
          src="data:text/html;base64,${Buffer.from(
            subResults.validate,
          ).toString('base64')}"
          sandbox="allow-same-origin"
          loading="lazy"
        ></iframe>
      </div>`
    : '';

  const sourceMarkup = await codeToHtml(subResults.source, shikiOptions);
  const expectedMarkup = await codeToHtml(subResults.expected, shikiOptions);

  return html`<tr>
    <td colspan="${colCount}">
      <details>
        <summary>Details</summary>
        ${readme}
        <div>
          <h4>Source</h4>
          ${sourceMarkup}
        </div>
        <div>
          <h4>Expected</h4>
          ${expectedMarkup}
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

async function table (allTests, testResults, isSummary = true, versions = null) {
  let rows = '';
  const minifierNames = minifiers;
  const colCount = 1 + minifierNames.length;

  for (const test in testResults.tests) {
    let row = '';
    const testId = test.replace('/', '-');
    if (isSummary) {
      row = html`<td><a href="#${test}">${test}</a></td>`;
    } else {
      const testNum = test.split('/').pop();
      row = html`<td>
        <a href="#${testId}"><code>${testNum}</code></a>
      </td>`;
    }

    const subResults = testResults.tests[test];
    for (const minifier in subResults.minifiers) {
      const minifierResult = subResults.minifiers[minifier];
      const cellClass =
        minifierResult.pass === minifierResult.checks
          ? 'pass'
          : minifierResult.pass === 0
            ? 'fail'
            : 'partial';

      if (minifierResult.error) {
        row += html`<td class="error" title="${minifierResult.error}">ERR</td>`;
      } else if (minifierResult.na) {
        row += html`<td class="na">N/A</td>`;
      } else if (!isSummary && minifierResult.checks === 1) {
        const match = minifierResult.pass === minifierResult.checks;
        row += html`<td class="${cellClass}">
          <span class="${match ? 'pass' : 'fail'}-icon"
            >${match ? CHECKMARK : CROSS_MARK}</span
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
      rows += await detailRow(test, subResults, minifierNames, colCount);
    }
  }

  let subtotalCells = '';
  let percentCells = '';
  let totalDuration = '';
  for (const minifier in testResults.totals) {
    const results = testResults.totals[minifier];

    let cellClass = 'partial';
    if (results.pass === allTests.length) {
      cellClass = 'pass';
    } else if (results.pass === 0) {
      cellClass = 'fail';
    }

    subtotalCells += html`<td class="${cellClass}">
      ${results.pass} / ${allTests.length}
    </td>`;
    percentCells += html`<td class="${cellClass}">
      ${Math.floor((results.pass / allTests.length) * 10000) / 100}%
    </td>`
    totalDuration += html`<td>
      ${formatMs(results.durations)}
    </td>`;
  }

  if (isSummary) {
    return html`<table>
      ${thead(['test', ...minifiers], versions)}
      <tbody>
        ${rows}
      </tbody>
      <tfoot>
        <tr>
          <td><strong>Total</strong></td>
          ${subtotalCells}
        </tr>
        <tr>
          <td><strong>Total (%)</strong></td>
          ${percentCells}
        </tr>
        <tr>
          <td><strong>Total Duration</strong></td>
          ${totalDuration}
        </tr>
      </tfoot>
    </table> `;
  }

  const tableId = `table-${Object.keys(testResults.tests)[0].split('/')[0]}`;
  return html`<button commandfor="${tableId}" command="--expand">
      Expand all
    </button>
    <table id="${tableId}">
      ${thead(['test', ...Object.keys(testResults.minifiers)])}
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

function page (body, history) {
  const historyJSON = JSON.stringify(history);
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

          <nav>
            <a href="#summary">Summary</a> |
            <a href="#historical">Historical Trends</a> |
            <a href="#real-world">Real-world Tests</a>
          </nav>

          <p>
            Correctness tests for CSS minification tools. Each test provides a
            CSS input and a single canonical minified output. A tool passes if
            its output matches exactly.
          </p>

          <p>
            <a href="https://github.com/keithamus/css-minify-tests"
              >Contribute tests on GitHub</a
            >
          </p>

          <button commandfor="results" command="--expand">Expand all</button>

          ${body}
        </main>
        <script>
          window.historyData = ${historyJSON};
        </script>
        <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
        <script src="script.js"></script>
      </body>
    </html> `;
}

export async function resultsAsHTML (allTests, testResults, versions, history, htmlFilePath) {
  let content = html`<section>
    <h2 id="summary">Summary</h2>
    ${await table(allTests, testResults, true, versions)}
  </section>`;

  if (history.length > 1) {
    content += html`<section>
      <h2 id="historical">Historical Trends</h2>
      <p>Pass rate over time across ${history.length} recorded runs.</p>
      <div id="pass-rate-chart" style="width:100%;height:400px;"></div>
    </section>`;
  }

  for (const test in testResults.tests) {
    content += html`<section id="${test}">
      <h2>${test}</h2>
      ${await table(allTests, testResults.tests[test], false)}
    </section>`;
  }

  const realWorldTable = await makeRealWorldTable();
  content += html`
    <section>
      <h2 id="real-world">Real-world tests</h2>
      <p>
        The following are the results of testing the minifiers
        on a corpus of real world, open source, CSS files/libraries.
      </p>
      ${realWorldTable}
    </section>
  `;

  await fs.writeFile(htmlFilePath, page(content, history));
}
