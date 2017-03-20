/**
 * BHHT Datascape Macro Controller
 * ================================
 *
 * Controller serving the data required to render the macro view.
 */
const model = require('../model');

module.exports = [
  {
    url: '/top-people',
    action(req, res) {
      return model.topPeople({name: req.query.name}, (err, people) => {
        if (err)
          return res.serverError(err);

        return res.ok(people);
      });
    }
  }
];
