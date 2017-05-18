/**
 * BHHT Datascape Generic Helpers Unit Tests
 * ==========================================
 */
const assert = require('assert');

const {
  createWikipediaLabel,
  tokenizeWikipediaLabel,
  lastMeaningfulTokenFromWikipediaLabel
} = require('../lib/helpers');

describe('Helpers', function() {

  describe('#.createWikipediaLabel', function() {

    it('should return a valid label.', function() {
      const tests = [
        ['Albert_Einstein', 'Albert Einstein'],
        ['%22Dr._Death%22_Steve_Williams', '"Dr. Death" Steve Williams'],
        ['!PAUS3', '!PAUS3']
      ];

      tests.forEach(function([name, label]) {
        assert.strictEqual(createWikipediaLabel(name), label, `${name} => ${label}`);
      });
    });
  });

  describe('#.tokenizeWikipediaLabel', function() {

    it('should return the expected tokens.', function() {

      const tests = [
        ['Albert Einstein', ['Albert', 'Einstein']],
        ['Albert Einstein (chanteur)', ['Albert', 'Einstein']],
        ['!PAUS3', ['PAUS']]
      ];

      tests.forEach(function([label, tokens]) {
        assert.deepEqual(tokenizeWikipediaLabel(label), tokens);
      });
    });
  });

  describe('#.lastMeaningfulTokenFromWikipediaLabel', function() {

    it('should correctly return the last meaningful token.', function() {
      const tests = [
        ['Albert Einstein', 'Einstein'],
        ['Albert Einstein (chanteur)', 'Einstein'],
        ['Kennedy', null],
        ['John F. Kennedy Jr.', 'Kennedy'],
        ['!PAUS3', null]
      ];

      tests.forEach(function([label, token]) {
        assert.strictEqual(lastMeaningfulTokenFromWikipediaLabel(label), token, `${label} => ${token}`);
      });
    });
  });
});
