import Papa from 'papaparse';
import {inflate} from 'pako';
import urljoin from 'url-join';
import split from 'obliterator/split';

const DEFAULT_PARSE_OPTIONS = {
  header: true,
  skipEmptyLines: true,
  dynamicTyping: true
};

function get(url, callback) {
  const complete = results => {
    if (results.errors.length !== 0) return callback(results.errors);

    return callback(null, results.data);
  };

  if (url.endsWith('.gz')) {
    return fetch(url)
      .then(response => response.arrayBuffer())
      .then(buffer => {
        const string = inflate(buffer, {to: 'string'});

        Papa.parse(string, {
          ...DEFAULT_PARSE_OPTIONS,
          complete
        });
      });
  }

  return Papa.parse(url, {
    ...DEFAULT_PARSE_OPTIONS,
    download: true,
    complete
  });
}

const DECODER = /(^\d+)/;
const UNDERSCORE = /_/g;

function decodeName(previous, entry) {
  let offset, suffix, s;

  if (entry.includes('§')) {
    s = entry.split('§');
    offset = +s[0];
    suffix = s[1];
  } else {
    s = entry.split(DECODER);
    offset = +s[1];
    suffix = s[2];
  }

  return (previous.slice(0, offset) + suffix).replace(UNDERSCORE, ' ');
}

function getNames(callback) {
  console.time('names');

  return fetch(urljoin(BASE_URL, 'names.txt.gz'))
    .then(response => response.arrayBuffer())
    .then(buffer => {
      const string = inflate(buffer, {to: 'string'});

      const names = [];

      let previous = '';

      for (const entry of split(/\n/g, string)) {
        const decoded = decodeName(previous, entry);

        names.push(decoded);

        previous = decoded;
      }

      console.timeEnd('names');
      return callback(null, names);
    });
}
