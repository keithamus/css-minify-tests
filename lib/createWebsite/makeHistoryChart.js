import {
  formatDate,
  html
} from '../helpers.js';

const TICKS = 10;

/**
 * Builds a line chart of passing tests per minifier across every recorded run.
 * Each row is one run and each column is one minifier. Minifiers are ordered
 * by their latest pass count so the legend follows the lines.
 *
 * @param  {object[]} history  The contents of results-history.json
 * @return {string}            Markup for the chart table
 */
export function makeHistoryChart (history) {
  const runs = history.toReversed();
  const latest = history[0].minifiers;
  const names = Array.from(new Set(history.flatMap((run) => {
    return Object.keys(run.minifiers);
  }))).sort((a, b) => {
    return (latest[b]?.pass || 0) - (latest[a]?.pass || 0);
  });
  const max = Math.ceil(Math.max(...history.map((run) => {
    return run.testCount;
  })) / 100) * 100;
  const tickEvery = Math.ceil(runs.length / TICKS);

  const legend = names
    .map((name) => {
      return html`<th id="${name}"><label><input type="checkbox" checked>${name}</label>`;
    })
    .join('');

  const rows = runs
    .map((run, index) => {
      const previous = runs[index - 1]?.minifiers;
      const cells = names
        .map((name) => {
          const result = run.minifiers[name];
          if (!result) {
            return html`<td headers="${name}">not tested`;
          }
          const before = previous?.[name];
          const style = before ? `--a:${before.pass};--b:${result.pass}` : `--dx:0px;--b:${result.pass}`;
          const percent = (result.pass / result.total * 100).toFixed(1);
          return html`<td headers="${name}" style="${style}">${percent}% (${result.pass}/${result.total}, v${result.version})`;
        })
        .join('');
      const classes = [
        index % tickEvery === 0 && 'tick',
        index >= runs.length / 2 && 'flip'
      ].filter(Boolean).join(' ');
      return html`<tr${classes ? ` class="${classes}"` : ''}><th>${formatDate(run.date)}${cells}`;
    })
    .join('\n');

  return html`<table class="chart lines" style="--min:0;--max:${max}">
    <caption>Passing tests<small>Tests passed by each minifier across ${history.length} recorded runs.</small></caption>
    <thead><tr><th>Date${legend}</thead>
    <tbody>
    ${rows}
    </tbody>
  </table>`;
}
