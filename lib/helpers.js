/**
 * BHHT Datascape Generic Helpers
 * ===============================
 *
 * Miscellaneous helpers used by both the client & the server.
 */

/**
 * Function taking a lang & a wikipedia name and returning its URL.
 */
exports.createWikipediaURL = function(lang, name) {
  return `https://${lang}.wikipedia.org/wiki/${name}`;
};
