/**
 * BHHT Datascape Generic Helpers Unit Tests
 * ==========================================
 */
const assert = require('assert');

const {
  createWikipediaLabel
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
});
