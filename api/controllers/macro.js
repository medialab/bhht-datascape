/**
 * BHHT Datascape Macro Controller
 * ================================
 *
 * Controller serving the data required to render the macro view.
 */
const model = require('../models/macro');

module.exports = [
  {
    url: '/top-people',
    action(req, res) {
      return res.ok({hello: 'world'});
    }
  }
];
