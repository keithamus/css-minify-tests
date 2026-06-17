import { minifiers } from '../loaders/loadAllMinifiers.js';
import { minifyAllRealWorldTests } from '../runners/realWorld.js';
import { ERROR } from '../constants.js';
import {
  formatMs,
  html
} from '../helpers.js';

const __dirname = import.meta.dirname;

const makeSizeTable = function (results) {
  const makeHeaders = function () {
    return minifiers
      .map((minifier) => {
        return '<th>' + minifier + '</th>';
      })
      .join('\n');
  };

  const makeRows = function () {
    function getClass (lowestSize, size) {
      if (size === ERROR) {
        return ' class="real-error"';
      }
      if (size === lowestSize) {
        return ' class="real-best"';
      }
      return '';
    }
    function getShortestClass (result, currentMinifier, currentDuration) {
      let isShortest = true;
      const size = result.results[currentMinifier];
      if (
        size === ERROR ||
        size === result.size
      ) {
        isShortest = false;
      }
      Object
        .entries(result.duration)
        .forEach(([minifier, time]) => {
          if (
            currentDuration > time &&
            result.results[minifier] !== ERROR &&
            result.results[minifier] !== result.size
          ) {
            isShortest = false;
          }
        });
      if (isShortest) {
        return ' class="real-best"'
      }
      return '';
    }
    function getLowestSize (result) {
      let lowestSize = result.size;
      Object.values(result.results)
        .forEach((size) => {
          if (size && size < lowestSize) {
            lowestSize = size;
          }
        });
      return lowestSize;
    }
    function getShortestDuration (result) {
      let shortestDuration = 900_000;
      Object.entries(result.duration)
        .forEach(([minifier, time]) => {
          const isShorter = time < shortestDuration;
          const isError = result.results[minifier] === ERROR;
          const isMinified = result.results[minifier] !== result.size;
          if (
            isShorter &&
            !isError &&
            isMinified
          ) {
            shortestDuration = time;
          }
        });
      return shortestDuration;
    }

    return results
      .map((result) => {
        const lowestSize = getLowestSize(result);
        const shortestDuration = getShortestDuration(result);

        const sizeTDs = Object
          .values(result.results)
          .map((size) => {
            const Class = getClass(lowestSize, size);
            return '<td' + Class + '>' + size.toLocaleString() + '</td>';
          })
          .join('\n');
        const percentTDs = Object
          .values(result.results)
          .map((size) => {
            const Class = getClass(lowestSize, size);
            if (size === ERROR) {
              return '<td' + Class + '>ERROR</td>';
            }
            const percent = Math.round((size / result.size) * 10000) / 100;
            return '<td' + Class + '>' + percent + '%</td>';
          })
          .join('\n');
        const durationTDs = Object
          .entries(result.duration)
          .map(([minifier, time]) => {
            let Class = getShortestClass(result, minifier, time);
            return '<td' + Class + '>' + time.toLocaleString() + 'ms</td>';
          })
          .join('\n');
        return `
          <tr class="real-tr">
            <td class="real-break" rowspan="2">
              ${result.name}<br>
              ${result.version}
            </td>
            <td class="real-sep">${result.size.toLocaleString()}</td>
            ${sizeTDs}
          </tr>
          <tr class="real-tr">
            <td class="real-sep">100%</td>
            ${percentTDs}
          </tr>
          <tr class="real-tr">
            <td>Duration</td>
            <td class="real-sep"></td>
            ${durationTDs}
          </tr>
        `;
      })
      .join('\n');
  };

  const getTotals = function () {
    const totals = {
      original: 0
    };
    for (const minifier of minifiers) {
      totals[minifier] = 0;
    }
    for (const result of results) {
      totals.original = totals.original + result.size;
      for (const minifier in result.results) {
        const amount = result.results[minifier];
        if (amount === ERROR) {
          // If it failed to minify, use the original
          // unminified size for the total.
          totals[minifier] = totals[minifier] + result.size;
        } else {
          totals[minifier] = totals[minifier] + amount;
        }
      }
    };
    return totals;
  };
  const getLowestSizeTotal = function (totals) {
    let lowestSize = 900_000_000;
    Object.values(totals).forEach((size) => {
      if (size < lowestSize) {
        lowestSize = size;
      }
    });
    return lowestSize;
  };
  const calculateTotals = function () {
    const totals = getTotals();
    const lowestSize = getLowestSizeTotal(totals);
    const totalsTDs = [];
    for (const minifier in totals) {
      const total = totals[minifier];
      let Class = '';
      if (total === lowestSize) {
        Class = ' class="real-best"';
      }
      totalsTDs.push(
        '<td' + Class + '>' +
        total.toLocaleString() +
        '<br>(' +
        (Math.round(total / 1024 / 1024 * 100) / 100) +
        'MB)' +
        '</td>'
      );
    }
    return totalsTDs.join('\n');
  };
  const calculatePercents = function () {
    const totals = getTotals();
    const lowestSize = getLowestSizeTotal(totals);
    const { original } = totals;
    const totalsTDs = [];
    for (const minifier in totals) {
      const total = totals[minifier];
      let Class = '';
      if (total === lowestSize) {
        Class = ' class="real-best"';
      }
      const percent = Math.round((total / original) * 10000) / 100;
      totalsTDs.push('<td' + Class + '>' + percent + '%</td>');
    }
    return totalsTDs.join('\n');
  };
  const getTotalDurations = function () {
    function getTotals () {
      const totals = {
      };
      for (const minifier of minifiers) {
        totals[minifier] = 0;
      }
      for (const result of results) {
        for (const minifier in result.results) {
          const duration = result.duration[minifier];
          totals[minifier] = totals[minifier] + duration;
        }
      };
      return totals;
    }
    const getShortestDuration = function (totals) {
      let shortestDuration = 900_000;
      Object.values(totals).forEach((duration) => {
        if (duration < shortestDuration) {
          shortestDuration = duration;
        }
      });
      return shortestDuration;
    }

    const totals = getTotals();
    const shortestDuration = getShortestDuration(totals);
    const totalsTDs = [];
    for (const minifier in totals) {
      const duration = totals[minifier];
      let Class = '';
      if (shortestDuration === duration) {
        Class = ' class="real-best"';
      }
      const time = formatMs(duration);
      totalsTDs.push('<td' + Class + '>' + time + '</td>');
    }
    return totalsTDs.join('\n');
  }
  const getTotalErrors = function () {
    const errors = {};
    for (const result of results) {
      for (const minifier in result.results) {
        errors[minifier] = errors[minifier] || 0;
        if (result.results[minifier] === ERROR) {
          errors[minifier] = errors[minifier] + 1;
        }
      }
    }
    const errorTDs = [];
    for (const minifier in errors) {
      const amount = errors[minifier];
      let Class = '';
      if (!amount) {
        Class = ' class="real-best"';
      }
      errorTDs.push('<td' + Class + '>' + amount + '</td>');
    }
    return errorTDs.join('\n');
  };

  const allHeaders = makeHeaders();
  const allRows = makeRows();
  const allTotals = calculateTotals();
  const allPercents = calculatePercents();
  const allDurations = getTotalDurations();
  const totalErrors = getTotalErrors();

  return `
    <table>
      <thead>
        <tr>
          <th>Library</th>
          <th>Original Size</th>
          ${allHeaders}
        </tr>
      </thead>
      <tbody>
        ${allRows}
      </tbody>
      <tfoot>
        <tr>
          <th colspan="2"></th>
          ${allHeaders}
        </tr>
        <tr>
          <th>Totals</th>
          ${allTotals}
        </tr>
        <tr>
          <th>Percent Reduction</th>
          ${allPercents}
        </tr>
        <tr>
          <th colspan="2">Total Durations</th>
          ${allDurations}
        </tr>
        <tr>
          <th colspan="2">Total Errors</th>
          ${totalErrors}
        </tr>
      </tfoot>
    </table>
  `;
};

export const makeRealWorldTable = async function () {
  console.log('Started minifying real world CSS files.');
  const results = await minifyAllRealWorldTests();
  const realWorldMarkup = html`
    <div>
      <style>
      .real-tr [rowspan] { border-right: 1px solid var(--border); }
      .real-tr:nth-of-type(3n) { border-bottom-width: 4px; }
      .real-tr:has(> [rowspan]) + .real-tr td:first-of-type {
        text-align: center;
      }
      .real-break { word-break: break-all; }
      .real-sep + td { border-left-width: 4px; }
      .real-best { background: #2C5229; color: #BFFFB9; }
      .real-error { background: #522929; color: #FFB9B9; }
      </style>
      ${makeSizeTable(results)}
    </div>
  `;
  return realWorldMarkup;
};
