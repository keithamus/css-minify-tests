/**
 * @file Creates the modal used by the Real World test results on the website.
 */

import { HEAVY_X } from '../constants.js';
import { html } from '../helpers.js';
import {
  getMinifierTitle,
  minifiers
} from '../loaders/loadAllMinifiers.js';

/**
 * Creates the Modal markup for the real world test results on the website.
 *
 * @return {string} Modal markup
 */
export const createModal = function () {
  const optionsList = [
    '<option value=""></option>'
  ];
  for (const minifierName of minifiers) {
    const minifierTitle = getMinifierTitle(minifierName);
    optionsList.push(html`
      <option value="${minifierName}">
        ${minifierTitle}
      </option>
    `);
  }
  return html`
    <dialog id="real-css-preview" closedby="any">
      <header>
        <h3><code id="real-modal-title"></code></h3>
        <label>
          Compare against
          <select
            id="real-seleect"
            onchange="window.realModal.showComparison(event)"
          >
            ${optionsList.join('')}
          </select>
        </label>
        <button
          id="real-moadal-close-button"
          onclick="window.realModal.hideModal()"
        >
          ${HEAVY_X}
        </button>
      </header>
      <div class="real-outputs">
        <pre id="real-minified-output" class="hljs"></pre>
        <pre id="real-comparison" class="hljs real-hide"></pre>
      </div>
    </dialog>
  `;
};
