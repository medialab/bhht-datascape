/**
 * BHHT Custom Typology
 * =====================
 *
 * Registering useful data types that need to be checked during runtime.
 */
const Typology = require('typology'),
      MACRO_MODES = require('./models/macro');

const types = new Typology();

/**
 * Macro view modes.
 */
types.add('macro:modes', value => MACRO_MODES.has(value));

module.exports = types;
