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
      padStart = require('lodash/padStart'),
      MultiSet = require('mnemonist/multi-set'),
      WritableBulk = require('elasticsearch-streams').WritableBulk,
      TransformToBulk = require('elasticsearch-streams').TransformToBulk,
      createWikipediaLabel = require('../lib/helpers').createWikipediaLabel,
      csv = require('csv'),
      fs = require('fs'),
      _ = require('lodash');

require('util').inspect.defaultOptions.colors = true;

// TODO: language the n traj field
// TODO: make a from/to and rename min/max => date for paths
// TODO: add birth/death to trajectory?
// TODO: date quality for path
// TODO: decide if life date_range is useful
// TODO: quid of people not have birth/death pseudo dates?
// TODO: rename path to point?
// TODO: rename subCategory to subcategory
// TODO: fix date format to Y rather than yyyy which is not fitting for historical dates
// TODO: create date range for path using min/max
// TODO: check path has no date < 0
// TODO: need to tokenize the suggestions

/**
 * Constants.
 */
const BASE_PEOPLE = 'base1_individus.csv',
      BASE_LOCATIONS = 'base2_locations.csv',
      BASE_PATHS = 'base3_trajectoires.csv';

const MAPPINGS = require('../specs/mappings.json'),
      CATEGORIES = require('../specs/meta.json').categories,
      ANALYZERS = require('../specs/analyzers.json');

const BULK_SIZES = {
  people: 700,
  location: 1500,
  path: 1500
};

const LOG_RATE = 10 * 1000;

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
const CLIENT = require('../api/client');

/**
 * Indices.
 */
const LOCATIONS = new Map(),
      LOCATIONS_SCORES = new MultiSet();

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
          analysis: {
            analyzer: ANALYZERS
          },
          refresh_interval: '60s'
        }
      }
    }, next);
  });
};

// Function used to pretty print numbers
const prettyNumber = number => padStart(numeral(number).format('0,0'), 9);

// Function used to create a lang map for some values
const POSSIBLE_LANGS = new Set(['en', 'fr', 'es', 'it', 'sv', 'de', 'pt']);

const pluralLangSplitter = string => {
  const langs = {};

  if (!string)
    return {};

  string.split('|').forEach(item => {
    const lang = item.slice(0, 2).toLowerCase(),
          value = +item.slice(2);

    if (!POSSIBLE_LANGS.has(lang))
      throw new Error(`Unknown "${lang}" lang!`);

    langs[lang] = value;
  });

  return langs;
};

// Function used to filter empty values from a document before indexation
const emptyFilter = doc => {
  for (const k in doc) {
    if (
      doc[k] === undefined ||
      doc[k] === '' ||
      doc[k] === '.' ||
      (Array.isArray(doc[k]) && !doc[k].length) ||
      (doc[k] && typeof doc[k] === 'object' && !Object.keys(doc[k]).length)
    )
      delete doc[k];
  }
};

// Function creating a logger only writing episodically at some given rate
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
      peopleLogger = createEpisodicLogger(LOG_RATE),
      pathLogger = createEpisodicLogger(LOG_RATE);

/**
 * Streams.
 */
const createCSVParserStream = () => csv.parse({delimiter: ',', columns: true});

const createTransformBulkStream = name => {
  return new TransformToBulk(doc => {
    const bulkObject = {
      _type: name
    };

    // Using the Wikipedia name as id if possible
    if (doc.name)
      bulkObject._id = doc.name;

    return bulkObject;
  });
};

// Readable streams
const readStreams = {

  // People
  people: () => fs
    .createReadStream(joinPath(argv.b, BASE_PEOPLE))
    .pipe(createCSVParserStream())
    .pipe(through.obj(function(doc, enc, next) {

      // People information
      const people = {
        name: doc.name,
        label: createWikipediaLabel(doc.name),
        wikipediaId: doc.id,
        gender: doc.gender,
        birthDate: doc.birth,
        deathDate: doc.death,
        pseudoBirthDate: doc.pseudo_birth,
        pseudoDeathDate: doc.pseudo_death,
        citizenship: doc.citizenship,
        region: doc.region,
        birthLocation: doc.place_of_birth,
        deathLocation: doc.place_of_death,
        dead: !!+doc.dead,
        languagesCount: doc.noccur_languages ? (+doc.noccur_languages + 1) : 1,
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

      people.suggest = {
        input: people.label,
        weight: Math.max.apply(null, [1].concat(_.values(people.notoriety)))
      };
      people.availableLanguagesCount = people.availableLanguages.length;

      // Trimming
      emptyFilter(people);

      // Life range
      if (people.pseudoBirthDate) {
        people.life = {
          gte: people.pseudoBirthDate
        };

        if (people.pseudoDeathDate)
          people.life.lte = people.pseudoDeathDate;
      }

      // Gathering occupations
      const occupations = new Map();

      for (let i = 1; i <= 3; i++) {
        const subCategory = doc['occupationB_' + i];

        if (!subCategory || subCategory === '.')
          continue;

        if (!occupations.has(subCategory)) {
          const category = CATEGORIES[subCategory];

          if (!category) {
            console.log(doc);
            throw new Error(`Unknown category for "${subCategory}" subCategory.`);
          }

          occupations.set(subCategory, {
            order: occupations.size + 1,
            weight: 1,
            category,
            subCategory
          });
        }
        else {
          occupations.get(subCategory).weight++;
        }
      }

      if (occupations.size)
        people.occupations = [...occupations.values()];

      // Caching main category & subcategory
      if (people.occupations && people.occupations.length) {
        const firstOccupation = people.occupations[0];

        people.category = firstOccupation.category;
        people.subCategory = firstOccupation.subCategory;
      }

      // Storing decades
      if (people.pseudoBirthDate) {
        const deathDate = +(people.pseudoDeathDate || '2020');

        const firstDecade = Math.floor(+people.pseudoBirthDate / 10) * 10,
              lastDecade = Math.ceil(+deathDate / 10) * 10;

        const decades = [];

        for (let year = firstDecade; year <= lastDecade; year += 10)
          decades.push('' + year);

        people.decades = decades;
      }

      peopleLogger(nb => `  -> (${prettyNumber(nb)}) people processed.`);

      this.push(people);

      return next();
    }))
    .pipe(createTransformBulkStream('people')),

  // Paths
  path: () => fs
    .createReadStream(joinPath(argv.b, BASE_PATHS))
    .pipe(createCSVParserStream())
    .pipe(through.obj(function(doc, enc, next) {
      const path = {
        lang: 'en',
        people: doc.name,
        location: doc.location,
        minDate: doc.min,
        maxDate: doc.max,
        order: +doc.n_traj
      };

      // Incrementing location score
      LOCATIONS_SCORES.add(doc.location);

      emptyFilter(path);

      pathLogger(nb => `  -> (${prettyNumber(nb)}) paths processed.`);

      this.push(path);

      return next();
    }))
    .pipe(createTransformBulkStream('path')),

  // Locations
  location: () => fs
    .createReadStream(joinPath(argv.b, BASE_LOCATIONS))
    .pipe(createCSVParserStream())
    .pipe(through.obj(function(doc, enc, next) {

      if (LOCATIONS.has(doc.location))
        return next();

      const location = {
        name: doc.location,
        label: createWikipediaLabel(doc.location),
        position: {
          lat: doc.lat,
          lon: doc.lon
        }
      };

      location.suggest = {
        input: location.label,
        weight: LOCATIONS_SCORES.multiplicity(doc.location)
      };

      LOCATIONS.set(location.name, location);

      locationLogger(nb => `  -> (${prettyNumber(nb)}) locations processed.`);

      this.push(location);

      return next();
    }))
    .pipe(createTransformBulkStream('location')),
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

  stream.highWaterMark = BULK_SIZES[name];

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
  function indexPeople(next) {
    console.log('Indexing people...');

    return readStreams
      .people()
      .pipe(writeStreams.people)
      .on('error', err => {
        throw err;
      })
      .on('close', () => next());
  },
  function indexPath(next) {
    console.log('Indexing paths...');

    return readStreams
      .path()
      .pipe(writeStreams.path)
      .on('error', err => {
        throw err;
      })
      .on('close', () => next());
  },
  function indexLocation(next) {
    console.log('Indexing locations...');

    return readStreams
      .location()
      .pipe(writeStreams.location)
      .on('error', err => {
        throw err;
      })
      .on('close', () => next());
  }
], err => {
  CLIENT.close();

  if (err)
    return console.error(err);

  console.log('Done!');
});
