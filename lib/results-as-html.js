import fs from 'node:fs/promises';

import { makeRealWorldTable } from './createWebsite/makeRealWorldTable.js';
import {
  makeGroupTable,
  makeSummaryTable
} from './createWebsite/makeTestTables.js';
import { html } from './helpers.js';
import { loadAllRealWorldTests } from './loaders/loadAllRealWorldTests.js';
import { HEAVY_X } from './constants.js';

function page (body, history) {
  const historyJSON = JSON.stringify(history);
  return html`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>CSS Minify Tests</title>
        <link rel="stylesheet" href="style.css" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.11.1/build/styles/sunburst.min.css"
        />
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

        <script
          src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.11.1/build/highlight.min.js"
        ></script>
        <script
          src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.11.1/build/languages/css.min.js"
        ></script>
      </body>
    </html> `;
}

export async function resultsAsHTML (allTests, testResults, versions, history, htmlFilePath) {
  const groups = Object.groupBy(allTests, function (test) {
    return test.groupName;
  });

  let content = html`<section>
    <h2 id="summary">Summary</h2>
    ${await makeSummaryTable(allTests, testResults, versions, groups)}
  </section>`;

  if (history.length > 1) {
    content += html`<section>
      <h2 id="historical">Historical Trends</h2>
      <p>Pass rate over time across ${history.length} recorded runs.</p>
      <div id="pass-rate-chart" style="width:100%;height:400px;"></div>
    </section>`;
  }

  for (const groupName in groups) {
    const group = groups[groupName];
    const results = testResults.groups[groupName];
    const versions = null;
    const groupTable = await makeGroupTable(allTests, results, group);
    content += html`<section id="${groupName}">
      <h2>${groupName} <a href="#${groupName}">#</a></h2>
      ${groupTable}
    </section>`;
  }

  const amountOfRealWorldTests = loadAllRealWorldTests().length;
  const realWorldTable = await makeRealWorldTable();
  content += html`
    <section>
      <h2 id="real-world">Real-world tests</h2>
      <dialog id="real-css-preview" closedby="any">
        <h3><code id="real-modal-title"></code></h3>
        <button
          id="real-moadal-close-button"
          onclick="window.realModal.hideModal()"
        >
          ${HEAVY_X}
        </button>
        <pre id="real-minified-output" class="hljs"></pre>
      </dialog>
      <p>
        The following are the results of testing the minifiers on
        <a
          href="https://github.com/TheJaredWilcurt/real-world-css-libraries"
          target="_blank"
        >a corpus</a> of ${amountOfRealWorldTests} real world,
        open source, CSS files/libraries.
      </p>
      ${realWorldTable}
    </section>
  `;

  await fs.writeFile(htmlFilePath, page(content, history));
}
