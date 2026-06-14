/**
 * @file Creats the summary table for the website.
 */

import { marked } from 'marked';
import { codeToHtml } from 'shiki';

import { minifiers } from '../loaders/loadAllMinifiers.js';
import {
  formatMs,
  html
} from '../helpers.js';

const CHECKMARK = '&#10003;'; // ✓
const CROSS_MARK = '&#10007;'; // ✗

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

export const makeGroupTable = async function (allTests, testResults, versions, groupName) {
  versions = versions ?? null
  let rows = '';
  const minifierNames = minifiers;
  const colCount = 1 + minifierNames.length;

  for (const test in testResults.tests) {
    let row = '';
    const testId = test.replace('/', '-');
    const testNum = test.split('/').pop();
    row = html`<td>
      <a href="#${testId}"><code>${testNum}</code></a>
    </td>`;

    const subResults = testResults.tests[test];
    for (const minifier in subResults.minifiers) {
      const minifierResult = subResults.minifiers[minifier];

      let cellClass = 'partial';
      if (minifierResult.pass === minifierResult.checks) {
        cellClass = 'pass';
      } else if (minifierResult.pass === 0) {
        cellClass = 'fail';
      }

      if (minifierResult.error) {
        row += html`<td class="error" title="${minifierResult.error}">ERR</td>`;
      } else if (minifierResult.checks === 1) {
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

    rows += html`<tr id="${testId}">
      ${row}
    </tr>`;
    rows += await detailRow(test, subResults, minifierNames, colCount);
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

  const tableId = 'table-' + groupName;
  return html`<button commandfor="${tableId}" command="--expand">
      Expand all
    </button>
    <table id="${tableId}">
      ${thead(['test', ...Object.keys(minifiers)])}
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
};

export const makeSummaryTable = async function (allTests, testResults, versions, groups) {
  versions = versions ?? null
  let rows = '';
  const minifierNames = minifiers;
  const colCount = 1 + minifierNames.length;

  for (const groupName in testResults.groups) {
    let row = '';
    const totalTestsInGroup = groups[groupName].length;

    row = html`<td><a href="#${groupName}">${groupName}</a></td>`;

    for (const minifierName of minifiers) {
      const subResult = testResults.groups[groupName][minifierName];
      const testsPassedByMinifierInGroup = subResult.pass;

      let cellClass = 'partial';
      if (testsPassedByMinifierInGroup === totalTestsInGroup) {
        cellClass = 'pass';
      } else if (testsPassedByMinifierInGroup === 0) {
        cellClass = 'fail';
      }

      row += html`<td class="${cellClass}">
        ${testsPassedByMinifierInGroup} / ${totalTestsInGroup}
      </td>`;
    }

    rows += html`<tr>
      ${row}
    </tr>`;
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
};
