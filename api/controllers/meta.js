/**
 * BHHT Datascape Meta Controller
 * ===============================
 *
 * Controller serving miscellaneous data.
 */
const model = require('../models/meta');

module.exports = [
  {
    url: '/distinct-instance-values',
    action(req, res) {
      return model.distinctInstanceValues((err, values) => {
        if (err)
          return res.serverError(err);

        return res.ok(values);
      });
    }
  }
];
