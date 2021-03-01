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
exports.createWikipediaURL = function (lang, name) {
  return `https://${lang}.wikipedia.org/wiki/${name}`;
};

/**
 * Function taking a wikipedia name & returning a readable label.
 */
const UNDERSCORE_REGEX = /_/g;
const SPACE_REGEX = /\s+/g;

exports.createWikipediaLabel = function (name, decode = true) {
  if (decode) name = decodeURIComponent(name);

  return name.replace(UNDERSCORE_REGEX, ' ');
};

exports.createWikipediaName = function (label) {
  return label.replace(SPACE_REGEX, '_');
};

/**
 * Function used to tokenize a wikipedia label.
 */
const PAREN_DROP_REGEX = /\([^)]+\)/g,
  NUMBER_TEST_REGEX = /\d/;

exports.tokenizeWikipediaLabel = function (label) {
  label = label.replace(PAREN_DROP_REGEX, '').trim();

  const tokens = words(label);

  return tokens.filter(token => !NUMBER_TEST_REGEX.test(token));
};

/**
 * Function used to return the last meaningful token of a wikipedia label.
 */
exports.lastMeaningfulTokenFromWikipediaLabel = function (label) {
  const tokens = exports
    .tokenizeWikipediaLabel(label)
    .filter(token => token.length > 3);

  if (tokens.length < 2) return null;

  return tokens[tokens.length - 1];
};
