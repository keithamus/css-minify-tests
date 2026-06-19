/* eslint-disable import-x/no-named-as-default-member */

/**
 * @file Configures ESLint rules for the project.
 */

import pluginJs from '@eslint/js';
import tjwBase from 'eslint-config-tjw-base';
import tjwImport from 'eslint-config-tjw-import-x';
import tjwJsdoc from 'eslint-config-tjw-jsdoc';
import pluginImport from 'eslint-plugin-import-x';

const config = [
  pluginJs.configs.recommended,
  pluginImport.flatConfigs.recommended,
  tjwBase.configs.recommended,
  tjwImport,
  ...tjwJsdoc,
  {
    languageOptions: {
      ecmaVersion: 2026
    },
    // project specific rules/settings
    rules: {
      'import-x/no-cycle': 'off',
      'import-x/no-extraneous-dependencies': 'off'
    }
  },
  {
    // This lightningcss module doesn't play nice with these rules
    files: ['./lib/minifiers/lightningcss.js'],
    rules: {
      'import-x/named': 'off',
      'import-x/namespace': 'off',
      'import-x/no-deprecated': 'off'
    }
  }
];

export default config;
