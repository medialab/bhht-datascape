/**
 * BHHT Datascape Generic Helpers
 * ===============================
 *
 * Miscellaneous helpers used by both the client & the server.
 */
const words = require('lodash/words');

/**
 * Function taking a lang & a wikipedia name and returning its URL.
 */
exports.createWikipediaURL = function(lang, name) {
  return `https://${lang}.wikipedia.org/wiki/${name}`;
};

/**
 * Function taking a wikipedia name & returning a readable label.
 */
const UNDERSCORE_REGEX = /_/g;

exports.createWikipediaLabel = function(name) {
  return decodeURIComponent(name).replace(UNDERSCORE_REGEX, ' ');
};

/**
 * Function used to tokenize a wikipedia label.
 */
const PAREN_DROP_REGEX = /\([^)]+\)/g;

exports.tokenizeWikipediaLabel = function(label) {
  return words(label.replace(PAREN_DROP_REGEX, '').trim());
};
