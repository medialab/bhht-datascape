/**
 * BHHT Datascape Build Index Script
 * ==================================
 *
 * Script used to create the ElasticSearch index from the CSV files.
 */
const yargs = require('yargs'),
      async = require('async'),
      joinPath = require('path').join,
      through = require('through2'),
      ElasticSearchClient = require('elasticsearch').Client,
      WritableBulk = require('elasticsearch-streams').WritableBulk,
      TransformToBulk = require('elasticsearch-streams').TransformToBulk,
      csv = require('csv'),
      fs = require('fs');

/**
 * Constants.
 */
const BASE_PEOPLE = 'base1_individus.csv',
      BASE_LOCATIONS = 'base2_locations.csv',
      BASE_PATHS = 'base3_trajectoires.csv';

const MAPPINGS = require('../mappings.json');

const PORT = 9200;

/**
 * Describing CLI interface.
 */
const argv = yargs
  .usage('$0 --base ./path/to/database')
  .option('b', {
    alias: 'base',
    demand: true,
    describe: 'Path of the CSV base\'s folder.'
  })
  .help()
  .argv;

/**
 * State & sessions.
 */
const CLIENT = new ElasticSearchClient({
  host: `localhost:${PORT}`
});

/**
 * Indices.
 */
const LOCATIONS = new Map();

/**
 * Streams.
 */
const CSV_PARSER_STREAM = csv.parse({delimiter: ',', columns: true});

const createTransformBulkStream = name => {
  return new TransformToBulk(doc => {
    return {
      _type: name
    };
  });
};

// Readable streams
const readStreams = {
  location: fs
    .createReadStream(joinPath(argv.b, BASE_LOCATIONS))
    .pipe(CSV_PARSER_STREAM)
    .pipe(through.obj(function(doc, enc, next) {

      if (LOCATIONS.has(doc.location))
        return next();

      const location = {
        name: doc.location,
        position: {
          lat: doc.lat,
          lon: doc.lon
        }
      };

      LOCATIONS.set(location.name, location);

      this.push(location);

      return next();
    }))
    .pipe(createTransformBulkStream('location'))
};

// Writable streams
const createWritableBulkStream = name => {
  const stream = new WritableBulk((body, next) => {
    return CLIENT.bulk({
      index: name,
      type: name,
      body
    }, next);
  });

  stream.highWaterMark = 1000;

  return stream;
};

const writeStreams = {
  location: createWritableBulkStream('location')
};

/**
 * Helpers.
 */
const createIndex = (name, next) => {
  CLIENT.indices.exists({index: name}, (err, result) => {
    if (err)
      return next(err);

    if (result)
      return next();

    // Actually creating the index
    return CLIENT.indices.create({
      index: name,
      body: {
        mappings: {
          [name]: MAPPINGS[name]
        },
        settings: {
          refresh_interval: '30s'
        }
      }
    }, next);
  });
};

/**
 * Process outline.
 */
async.series([
  function createIndices(next) {
    return async.parallel([
      async.apply(createIndex, 'location')
    ], next);
  },
  function indexLocation(next) {
    console.log('Indexing locations...');

    return readStreams
      .location
      .pipe(writeStreams.location)
      .on('error', next)
      .on('close', () => next());
  }
], err => {
  CLIENT.close();

  if (err)
    return console.error(err);
});
