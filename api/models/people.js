/**
 * BHHT People Model
 * ==================
 *
 * Model in charge of retrieving precise information concerning a single
 * person of the database.
 */
const client = require('../client');

/**
 * Function retrieving information for the given people.
 */
exports.get = function(id, callback) {
  return client.get({index: 'people', type: 'people', id}, (err1, people) => {
    if (err1) {
      if (err1.status === 404)
        return callback(null, null);
      return callback(err1);
    }

    const person = people._source;

    const pathBody = {
      query: {
        term: {
          people: id
        }
      },
      sort: [
        {
          order: 'asc'
        }
      ],
      size: 5000
    };

    return client.search({index: 'path', body: pathBody}, (err2, pathResult) => {
      if (err2)
        return callback(err2);

      person.paths = pathResult.hits.hits.map(hit => {
        return {
          location: hit._source.location
        };
      });

      return callback(null, person);
    });
  });
};

/**
 * Function retrieving suggestions for people.
 */
exports.suggestions = function(query, callback) {
  const body = {
    suggest: {
      people: {
        prefix: query,
        completion: {
          field: 'suggest',
          fuzzy: true,
          size: 50
        }
      }
    }
  };

  return client.search({index: 'people', body}, (err, result) => {
    if (err)
      return callback(err);

    const people = result.suggest.people[0].options.map(hit => {
      return {
        label: hit._source.label,
        name: hit._source.name
      };
    });

    return callback(null, people);
  });
};
