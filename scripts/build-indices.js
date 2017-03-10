/* eslint no-console: 0 */
/**
 * BHHT Datascape Build Index Script
 * ==================================
 *
 * Script used to create the ElasticSearch index from the CSV files.
 */
const yargs = require('yargs'),
      async = require('async'),
      numeral = require('numeral'),
      joinPath = require('path').join,
      through = require('through2'),
      ElasticSearchClient = require('elasticsearch').Client,
      WritableBulk = require('elasticsearch-streams').WritableBulk,
      TransformToBulk = require('elasticsearch-streams').TransformToBulk,
      csv = require('csv'),
      fs = require('fs');

require('util').inspect.defaultOptions.colors = true;

/**
 * Constants.
 */
const BASE_PEOPLE = 'base1_individus.csv',
      BASE_LOCATIONS = 'base2_locations.csv';
      // BASE_PATHS = 'base3_trajectoires.csv';

const MAPPINGS = require('../mappings.json');

const PORT = 9200,
      BULK_SIZE = 1000,
      LOG_RATE = 10 * 1000;

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

const prettyNumber = number => numeral(number).format('0,0');

const POSSIBLE_LANGS = new Set(['en', 'fr', 'es', 'it', 'sv', 'de', 'pt']);

const pluralLangSplitter = string => {
  const langs = {};

  string.split('|').forEach(item => {
    const lang = item.slice(0, 2).toLowerCase(),
          value = +item.slice(2);

    // TODO: remove this with new file version
    // TODO: error, the join function is not correct on Stata's side!
    if (lang === 'sp')
      return;

    if (!POSSIBLE_LANGS.has(lang))
      throw new Error(`Unknown "${lang}" lang!`);

    langs[lang] = value;
  });

  return langs;
};

const createEpisodicLogger = rate => {
  let i = 0;

  return fn => {
    i++;

    if (i % rate)
      return;

    console.log(fn(i));
  };
};

const locationLogger = createEpisodicLogger(LOG_RATE),
      peopleLogger = createEpisodicLogger(LOG_RATE);

/**
 * Streams.
 */
const createCSVParserStream = () => csv.parse({delimiter: ',', columns: true});

const createTransformBulkStream = name => {
  return new TransformToBulk(() => {
    return {
      _type: name
    };
  });
};

// Readable streams
const readStreams = {

  // Locations
  location: fs
    .createReadStream(joinPath(argv.b, BASE_LOCATIONS))
    .pipe(createCSVParserStream())
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

      locationLogger(i => `  -> (${prettyNumber(i)}) locations processed.`);

      this.push(location);

      return next();
    }))
    .pipe(createTransformBulkStream('location')),

  // People
  people: fs
    .createReadStream(joinPath(argv.b, BASE_PEOPLE))
    .pipe(createCSVParserStream())
    .pipe(through.obj(function(doc, enc, next) {

      // People information
      const people = {
        name: doc.name,
        gender: doc.gender,
        birthDate: doc.birth,
        deathDate: doc.death,
        pseudoBirthDate: doc.pseudo_birth,
        pseudoDeathDate: doc.pseudo_death,
        citizenship: doc.citizenship,
        region: doc.region,
        birthPlace: doc.place_of_birth,
        deathPlace: doc.place_of_death,
        dead: !!+doc.dead,
        languagesCount: +doc.noccur_languages + 1,
        mainLanguage: doc.language,
        originalId: doc.newid,
        approxBirth: !!+doc.approx_birth_num,
        approxDeath: !!+doc.approx_death_num,
        continent: doc.Continent,
        period: doc.BigPeriod !== 'missing' ? doc.BigPeriod : undefined,
        availableLanguages: doc.ID_LANGUE.split('|').map(item => item.toLowerCase()),
        words: pluralLangSplitter(doc.count_words),
        length: pluralLangSplitter(doc.length),
        notoriety: pluralLangSplitter(doc.notoriety),
        ranking: pluralLangSplitter(doc.ranking_notoriety)
      };

      // Trimming
      for (const k in people) {
        if (
          people[k] === undefined ||
          people[k] === '' ||
          people[k] === '.' ||
          (Array.isArray(people[k]) && !people[k].length) ||
          (people[k] && typeof people[k] === 'object' && !Object.keys(people[k]).length)
        )
          delete people[k];
      }

      // Gathering occupations
      // TODO: await new version of the file

      peopleLogger(i => `  -> (${prettyNumber(i)}) people processed.`);

      this.push(people);

      return next();
    }))
    .pipe(createTransformBulkStream('people'))
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

  stream.highWaterMark = BULK_SIZE;

  return stream;
};

const writeStreams = {
  location: createWritableBulkStream('location'),
  people: createWritableBulkStream('people'),
  path: createWritableBulkStream('path')
};

/**
 * Process outline.
 */
console.log('Building indices...');
async.series([
  function createIndices(next) {
    return async.parallel([
      async.apply(createIndex, 'location'),
      async.apply(createIndex, 'people'),
      async.apply(createIndex, 'path')
    ], next);
  },
  // function indexLocation(next) {
  //   console.log('Indexing locations...');

  //   return readStreams
  //     .location
  //     .pipe(writeStreams.location)
  //     .on('error', err => {
  //       throw err;
  //     })
  //     .on('close', () => next());
  // },
  function indexPeople(next) {
    console.log('Indexing people...');

    return readStreams
      .people
      .pipe(writeStreams.people)
      .on('error', err => {
        throw err;
      })
      .on('close', () => next);
  }
], err => {
  CLIENT.close();

  if (err)
    return console.error(err);
});
