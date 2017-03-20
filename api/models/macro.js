/**
 * BHHT Macro Model
 * =================
 *
 * Model in charge of querying the ElasticSearch database for the necessary
 * data for the macro view.
 */
const client = require('../client');

const MACRO_MODES = new Set([
  'global',
  'categories',
  'gender',
  'languages'
]);
exports.MACRO_MODES = MACRO_MODES;
