/**
 * @file Client-side JS ran on the website.
 */

/* eslint-disable-next-line import-x/no-unresolved */
import { diffChars } from 'https://cdn.jsdelivr.net/npm/diff@9.0.0/libesm/diff/character.js';

document.addEventListener('command', (e) => {
  if (e.command === '--expand' || e.command == '--collapse') {
    const open = e.command === '--expand';
    for (const d of e.target.querySelectorAll('details')) {
      d.open = open;
    }
  }
}, true);

document.addEventListener('toggle', (e) => {
  const root = e.target.closest('table');
  if (!root) {
    return;
  }
  const btn = document.querySelector(`button[commandfor='${root.id}']`);
  const globalButton = document.querySelector('button[commandfor="results"]');
  for (const d of root.querySelectorAll('details')) {
    if (!d.open) {
      globalButton.textContent = btn.textContent = 'Expand all';
      globalButton.command = btn.command = '--expand';
      return;
    }
  }
  globalButton.textContent = btn.textContent = 'Collapse all';
  globalButton.command = btn.command = '--collapse';
}, true);

/**
 * Loads the #hash from the URL, if it's in a <details>, it expands it, then
 * scrolls into view.
 */
function openHash () {
  const hash = location.hash.slice(1) || '';
  const el = document.getElementById(hash);
  const row = el?.closest('tr');
  if (!row) {
    return;
  }
  const details = row.nextElementSibling?.querySelector('details');
  if (details) {
    details.open = true;
  }
  el.scrollIntoView();
}

openHash();
window.addEventListener('hashchange', openHash);

// Historical trend chart
(function () {
  const el = document.getElementById('pass-rate-chart');
  if (!el || typeof window.ApexCharts === 'undefined') {
    return;
  }
  const data = window.historyData;
  if (!data || data.length < 2) {
    return;
  }

  const reversed = [...data].reverse();
  const minifierNames = Object.keys(reversed[0].minifiers);

  // Gets the largest test count and rounds up to nearest 100th
  const max = Math.ceil(Math.max(...data.map((result) => {
    return result.testCount;
  })) / 100) * 100;

  const series = minifierNames.map((name) => ({
    name,
    data: reversed
      .map((entry) => {
        const m = entry.minifiers[name];
        if (!m || m.total === 0) {
          return null;
        }
        return {
          x: new Date(entry.date).getTime(),
          y: m.pass
        };
      })
      .filter(Boolean)
  }));

  const isDark =
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  const chart = new window.ApexCharts(el, {
    series,
    chart: {
      type: 'line',
      height: 400,
      background: isDark ? '#0f0f0f' : '#ffffff',
      zoom: { enabled: true },
      toolbar: { show: true },
      animations: { enabled: false }
    },
    stroke: { curve: 'straight', width: 2 },
    dataLabels: { enabled: false },
    xaxis: {
      type: 'datetime',
      title: { text: 'Date' },
      labels: {
        datetimeUTC: false
      }
    },
    yaxis: {
      title: { text: 'Total Passing Tests' },
      min: 0,
      max,
      decimalsInFloat: 1
    },
    tooltip: {
      shared: true,
      intersect: false,
      x: { format: 'MMM dd, yyyy' },
      y: {
        formatter: function (y, { seriesIndex, dataPointIndex, w }) {
          if (typeof y !== 'number' || isNaN(y)) {
            return y;
          }
          const name = w.config.series[seriesIndex].name;
          const entry = reversed[dataPointIndex];
          const m = entry && entry.minifiers[name];
          const extra = m ? ` (${m.pass}/${m.total} v${m.version})` : '';
          const percent = ((m.pass / m.total) * 100).toFixed(1) + '%';
          return percent + extra;
        }
      }
    },
    legend: { position: 'bottom' },
    grid: {
      borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'
    },
    theme: isDark ? { mode: 'dark', palette: 'palette4' } : { mode: 'light' }
  });
  chart.render();

  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (e) => {
      const dark = e.matches;
      chart.updateOptions({
        chart: { background: dark ? '#0f0f0f' : '#ffffff' },
        grid: {
          borderColor: dark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'
        },
        theme: dark ? { mode: 'dark', palette: 'palette4' } : { mode: 'light' }
      });
    });
})();


/* CSS Modal */

window.realModal = {
  // Native elements bindings
  elementsMap: {
    container: 'real-css-preview',
    title: 'real-modal-title',
    select: 'real-select',
    close: 'real-moadal-close-button',
    pre: 'real-minified-output',
    diffBox: 'real-comparison-diff'
  },
  constants: {
    LOADING: 'Loading...'
  },
  // Loaded file data for the left/right sides
  data: {
    left: '',
    right: ''
  },
  /**
   * Gets the Modal Container DOM node.
   *
   * @return {HTMLElement} Reference to DOM node
   */
  getModal: function () {
    return document.getElementById(this.elementsMap.container);
  },
  /**
   * Gets the Modal Title DOM node.
   *
   * @return {HTMLElement} Reference to DOM node
   */
  getModalTitle: function () {
    return document.getElementById(this.elementsMap.title);
  },
  /**
   * Gets the <select> dropdown element.
   *
   * @return {HTMLElement} Reference to DOM node
   */
  getSelect: function () {
    return document.getElementById(this.elementsMap.select);
  },
  /**
   * Gets the Modal Close button DOM node.
   *
   * @return {HTMLElement} Reference to DOM node
   */
  getXButton: function () {
    return document.getElementById(this.elementsMap.close);
  },
  /**
   * Gets the Modal <pre> DOM node.
   *
   * @return {HTMLElement} Reference to DOM node
   */
  getOutputBox: function () {
    return document.getElementById(this.elementsMap.pre);
  },
  /**
   * Gets the right-side <pre> DOM node of the modal used for syntax
   * highlighting and diffing.
   *
   * @return {HTMLElement} Reference to DOM node
   */
  getDiffBox: function () {
    return document.getElementById(this.elementsMap.diffBox);
  },

  // Modal state/visibility
  /**
   * Updates the Modal title, sets the loading state and shows the modal.
   *
   * @param {string} minifierName  Name of the minifier ('csso', 'sass', etc)
   * @param {string} fileName      Minified CSS filename ('bttn-v0.2.4.css')
   */
  resetAndOpenModal: function (minifierName, fileName) {
    const modalEl = this.getModal();
    const titleEl = this.getModalTitle();
    const selectEl = this.getSelect();
    const preEl = this.getOutputBox();
    const diffBoxEl = this.getDiffBox();

    // Reset the loading state before opening
    titleEl.innerText = minifierName + '/' + fileName;
    selectEl.value = '';
    preEl.innerText = this.constants.LOADING;
    diffBoxEl.innerText = this.constants.LOADING;
    diffBoxEl.classList.add('real-hide');
    modalEl.showModal();
  },
  /** Closes the modal. */
  hideModal: function () {
    const modalEl = this.getModal();
    modalEl.close();
  },

  /**
   * Loads in the content for, and shows, the comparison box with a different
   * minifiers result.
   *
   * @param {object} $event  Native browser onchange event
   */
  showComparison: async function ($event) {
    const minifierName = $event?.target?.value;
    const diffBoxEl = this.getDiffBox();
    if (minifierName) {
      diffBoxEl.classList.remove('real-hide');
      const modalTitleEl = this.getModalTitle();
      const title = modalTitleEl.innerText;
      const fileName = title.split('/')[1];
      this.data.right = await this.getMinifiedCSS(minifierName, fileName);
      diffBoxEl.innerHTML = '';
      diffBoxEl.appendChild(this.diffLeftRight());
    } else {
      this.data.right = '';
      diffBoxEl.classList.add('real-hide');
      diffBoxEl.innerHTML = this.constants.LOADING;
    }
  },

  // Loading/Formatting data
  /**
   * Loads the minified CSS file for a given minifier from a network call, then
   * places the contents inside the modal with syntax highlighting.
   *
   * @param  {string}          minifierName  Name of the minifier ('csso', 'sass', etc)
   * @param  {string}          fileName      Minified CSS filename ('bttn-v0.2.4.css')
   * @param  {boolean}         reminified    If true, use the reminified folder
   * @return {Promise<string>}               The CSS as syntax highlighted markup
   */
  getMinifiedCSS: function (minifierName, fileName, reminified) {
    let folder = 'minified';
    if (reminified) {
      folder = 'reminified';
    }
    const url = [
      folder,
      minifierName,
      fileName
    ].join('/');
    return fetch(url)
      .then((response) => {
        return response.text();
      });
  },
  /**
   * Applies syntax highlighting to a given string of CSS.
   *
   * @param  {string} css  Any string of CSS to be syntax highlighted
   * @return {string}      A string of markup for syntax highlighted CSS
   */
  highlightSyntax: function (css) {
    const options = {
      language: 'css'
    };
    const highlightedCode = window.hljs.highlight(css, options).value;
    return highlightedCode;
  },
  /**
   * Finds the added/removed changes to the left and right sides of the modal.
   * Returns an HTML fragment of DOM nodes with diff highlighting applied.
   *
   * @return {object} An HTML fragment with span DOM nodes.
   */
  diffLeftRight: function () {
    const { left, right } = this.data;
    const diff = diffChars(left, right, { ignoreCase: true });
    const fragment = document.createDocumentFragment();
    let span;

    diff.forEach((part) => {
      span = document.createElement('span');
      if (part.added) {
        span.classList.add('real-diff-added');
      } else if (part.removed) {
        span.classList.add('real-diff-removed');
      }
      span.innerHTML = this.highlightSyntax(part.value);
      fragment.appendChild(span);
    });

    return fragment;
  },

  // Logic composition
  /**
   * Resets the modal, shows it, loads CSS data for the modal.
   *
   * @param {string} minifierName  Name of the minifier ('csso', 'sass', etc)
   * @param {string} fileName      Minified CSS filename ('bttn-v0.2.4.css')
   */
  showMinifiedCSS: async function (minifierName, fileName) {
    this.resetAndOpenModal(minifierName, fileName);
    this.data.left = await this.getMinifiedCSS(minifierName, fileName);
    const preEl = this.getOutputBox();
    preEl.innerHTML = this.highlightSyntax(this.data.left);
  },
  /**
   * Resets the modal, shows it, loads CSS data for the modal.
   *
   * @param {string} minifierName  Name of the minifier ('csso', 'sass', etc)
   * @param {string} fileName      Minified CSS filename ('bttn-v0.2.4.css')
   */
  showReminifiedCSS: async function (minifierName, fileName) {
    this.resetAndOpenModal(minifierName, fileName);
    this.data.left = await this.getMinifiedCSS(minifierName, fileName, true);
    const preEl = this.getOutputBox();
    preEl.innerHTML = this.highlightSyntax(this.data.left);
  }
};
