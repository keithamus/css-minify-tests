/**
 * @file Creats the summary table for the website.
 */

import { marked } from 'marked';
import { codeToHtml } from 'shiki';

import {
  getMinifierTitle,
  minifiers
} from '../loaders/loadAllMinifiers.js';
import {
  CHECKMARK,
  CROSS_MARK,
  ERROR
} from '../constants.js';
import {
  formatMs,
  html
} from '../helpers.js';

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

async function detailRow (test) {
  // Themes can be previewed at:
  // https://textmate-grammars-themes.netlify.app/?theme=dark-plus&grammar=css
  const shikiOptions = {
    lang: 'css',
    theme: 'dark-plus'
  };

  const readme = html`<p>
    ${marked.parse(test.readme)}
  </p>`;

  let outputs = '';
  let durations = '';
  for (const minifierName of minifiers) {
    const duration = test.durations[minifierName];
    durations += html`<div>${formatMs(duration)}</div>`;

    const expected = test.expected;
    const error = test.errors[minifierName];
    const actual = test.actual[minifierName];
    if (error) {
      let errorMarkup = await codeToHtml(error, shikiOptions);
      const preClass = '<pre class="';
      if (errorMarkup.startsWith(preClass)) {
        errorMarkup = errorMarkup.replace(preClass,  preClass + 'detail-error ');
      }
      outputs += html`<div class="detail-fail">
        <h4>${minifierName} <span class="fail-icon">${CROSS_MARK}</span></h4>
        ${errorMarkup}
      </div>`;
    } else if (actual !== null) {
      const match = actual === expected;
      const actualMarkup = await codeToHtml(actual, shikiOptions);
      const icon = match ? 'pass-icon' : 'fail-icon';
      const mark = match ? CHECKMARK : CROSS_MARK;
      outputs += html`<div class="detail-${match ? 'pass' : 'fail'}">
        <h4>
          ${minifierName}
          <span class="${icon}">
            ${mark}
          </span>
        </h4>
        ${actualMarkup}
      </div>`;
    }
  }

  const validate = test.validate
    ? html`<div>
        <h4>Validate</h4>
        <iframe
          src="data:text/html;base64,${Buffer.from(test.validate).toString('base64')}"
          sandbox="allow-same-origin"
          loading="lazy"
        ></iframe>
      </div>`
    : '';

  const sourceMarkup = await codeToHtml(test.source, shikiOptions);
  const expectedMarkup = await codeToHtml(test.expected, shikiOptions);
  const colCount = (1 + minifiers.length);

  const detailStyles = [
    'margin-left: ' + ((1 / colCount) * 100) + '%',
    'grid-template-columns: repeat(' + minifiers.length + ', 1fr)'
  ].join(';')

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
            style="${detailStyles}"
          >
            ${outputs}
          </div>
          <div
            class="detail-durations"
            style="${detailStyles}"
          >
            ${durations}
          </div>
        </div>
      </details>
    </td>
  </tr>`;
}

function makeTestOverviewRow (test) {
  const {
    expected,
    groupName,
    testNumber
  } = test;

  const testId = groupName + '-' + testNumber;
  let row = html`
    <tr id="${testId}">
      <td>
        <a href="#${testId}"><code>${testNumber}</code></a>
      </td>
  `;

  for (const minifierName of minifiers) {
    const minifierTitle = getMinifierTitle(minifierName);
    const duration = test.durations[minifierName];
    const actual = test.actual[minifierName];
    const error = test.errors[minifierName];

    let cellClass = 'fail';
    let icon = 'fail-icon';
    let mark = CROSS_MARK;
    let title = '';

    if (actual === expected) {
      cellClass = 'pass';
      icon = 'pass-icon';
      mark = CHECKMARK;
      title = [
        minifierTitle,
        'passed',
        groupName + '/' + testNumber,
        'in',
        formatMs(duration)
      ].join(' ');
    } else {
      title = [
        minifierTitle,
        'failed',
        groupName + '/' + testNumber
      ].join(' ');
    }
    if (error) {
      cellClass = 'error';
      mark = ERROR;
      title = [
        minifierTitle + ' failed:',
        error.replaceAll('"', '&quot;')
      ].join('\n');
    }

    row += html`<td class="${cellClass}" title="${title}">
      <span class="${icon}">${mark}</span>
    </td>`;
  }

  row += html`
    </tr>
  `;

  return row;
}

function makeTestSubTotalRow (testResults, group) {
  let subtotalCells = '';
  let percentCells = '';
  let totalDurationCells = '';
  for (const minifierName in testResults) {
    let durations = 0;
    for (const test of group) {
      durations += test.durations[minifierName];
    }

    const results = testResults[minifierName].pass;

    let cellClass = 'partial';
    if (results === group.length) {
      cellClass = 'pass';
    } else if (results === 0) {
      cellClass = 'fail';
    }

    subtotalCells += html`<td class="${cellClass}">
      ${results} / ${group.length}
    </td>`;
    percentCells += html`<td class="${cellClass}">
      ${Math.floor((results / group.length) * 10000) / 100}%
    </td>`
    totalDurationCells += html`<td>
      ${formatMs(durations)}
    </td>`;
  }

  return html`
    <tr>
      <td><strong>Subtotal</strong></td>
      ${subtotalCells}
    </tr>
    <tr>
      <td><strong>Percent</strong></td>
      ${percentCells}
    </tr>
    <tr>
      <td><strong>Duration</strong></td>
      ${totalDurationCells}
    </tr>
  `;
}

export const makeGroupTable = async function (allTests, testResults, group) {
  const tableId = 'table-' + group[0].groupName;

  let rows = '';
  for (const test of group) {
    rows += makeTestOverviewRow(test);
    rows += await detailRow(test);
  }
  const subTotalRow = makeTestSubTotalRow(testResults, group);

  return html`<button commandfor="${tableId}" command="--expand">
      Expand all
    </button>
    <table id="${tableId}">
      ${thead(['test', ...minifiers])}
      <tbody>
        ${rows}
      </tbody>
      <tfoot>
        ${subTotalRow}
      </tfoot>
    </table> `;
};

export const makeSummaryTable = async function (allTests, testResults, versions, groups) {
  versions = versions ?? null
  let rows = '';
  const colCount = 1 + minifiers.length;

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
