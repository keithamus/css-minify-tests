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

const ZOOM_RADIUS = 3;
const zoomedCharts = new WeakMap();

/**
 * Returns an axis range covering low to high, split into equal whole-number
 * steps.
 *
 * @param  {number} low    Smallest value to show
 * @param  {number} high   Largest value to show
 * @param  {number} ticks  Number of steps
 * @return {object}        The axis `min` and `max`
 */
function niceScale (low, high, ticks) {
  const raw = Math.max(high - low, 1) / ticks;
  for (let exponent = Math.max(0, Math.floor(Math.log10(raw))); ; exponent++) {
    for (const mantissa of [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8]) {
      const step = mantissa * 10 ** exponent;
      if (step < raw || !Number.isInteger(step)) {
        continue;
      }
      const min = Math.floor(low / step) * step;
      if (min + step * ticks >= high) {
        return { min, max: min + step * ticks };
      }
    }
  }
}

/**
 * Fits a zoomed line chart's y-axis to the series shown in its legend.
 *
 * @param {HTMLTableElement} table  The chart
 */
function rescaleZoomed (table) {
  const columns = new Set(
    [...table.tHead.rows[0].cells]
      .filter((cell) => cell.querySelector('input:checked'))
      .map((cell) => cell.cellIndex)
  );
  const values = [];
  for (const row of table.tBodies[0].rows) {
    for (const cell of row.cells) {
      const value = parseFloat(cell.style.getPropertyValue('--b'));
      if (columns.has(cell.cellIndex) && !Number.isNaN(value)) {
        values.push(value);
      }
    }
  }
  if (!values.length) {
    return;
  }
  const { min, max } = niceScale(Math.min(...values), Math.max(...values), 4);
  table.style.setProperty('--min', min);
  table.style.setProperty('--max', max);
}

/**
 * Zooms a line chart in on the runs around a row, or back out to every run.
 *
 * @param {HTMLTableElement}    table  The chart
 * @param {HTMLTableRowElement} row    The clicked run
 */
function toggleZoom (table, row) {
  const tbody = table.tBodies[0];
  const full = zoomedCharts.get(table);
  if (full) {
    tbody.replaceChildren(...full.rows);
    table.style.setProperty('--min', full.min);
    table.style.setProperty('--max', full.max);
    zoomedCharts.delete(table);
    delete table.dataset.zoomed;
    return;
  }
  const rows = [...tbody.rows];
  const size = ZOOM_RADIUS * 2 + 1;
  const start = Math.max(0, Math.min(row.sectionRowIndex - ZOOM_RADIUS, rows.length - size));
  zoomedCharts.set(table, {
    rows,
    min: table.style.getPropertyValue('--min'),
    max: table.style.getPropertyValue('--max')
  });
  tbody.replaceChildren(...rows.slice(start, start + size));
  table.dataset.zoomed = '';
  rescaleZoomed(table);
}

document.addEventListener('click', (e) => {
  const row = e.target.closest('.lines tbody tr');
  if (row) {
    toggleZoom(row.closest('.chart'), row);
  }
});

document.addEventListener('change', (e) => {
  const table = e.target.closest('.chart');
  if (table && zoomedCharts.has(table)) {
    rescaleZoomed(table);
  }
});

for (const table of document.querySelectorAll('.lines')) {
  table.dataset.interactive = '';
}

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
    reminified: false,
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
    this.data.reminified = false;
    this.data.left = '';
    this.data.right = '';
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
    let diff;
    const diffOptions = { ignoreCase: true };
    if (this.data.reminified) {
      diff = diffChars(right, left, diffOptions);
    } else {
      diff = diffChars(left, right, diffOptions);
    }
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
    this.data.reminified = true;
    this.data.left = await this.getMinifiedCSS(
      minifierName,
      fileName,
      this.data.reminified
    );
    const preEl = this.getOutputBox();
    preEl.innerHTML = this.highlightSyntax(this.data.left);
  }
};
