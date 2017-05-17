/**
 * BHHT Datascape Generic Helpers Unit Tests
 * ==========================================
 */
const assert = require('assert');

const {
  createWikipediaLabel,
  tokenizeWikipediaLabel
} = require('../lib/helpers');

describe('Helpers', function() {

  describe('#.createWikipediaLabel', function() {

    it('should return a valid label.', function() {
      const tests = [
        ['Albert_Einstein', 'Albert Einstein'],
        ['%22Dr._Death%22_Steve_Williams', '"Dr. Death" Steve Williams']
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
        ['Albert Einstein (chanteur)', ['Albert', 'Einstein']]
      ];

      tests.forEach(function([label, tokens]) {
        assert.deepEqual(tokenizeWikipediaLabel(label), tokens);
      });
    });
  });
});
