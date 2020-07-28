import {EventEmitter} from 'events';
import {useState, useEffect} from 'react';
import Papa from 'papaparse';
import {inflate} from 'pako';
import urljoin from 'url-join';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import split from 'obliterator/split';
import meta from '../specs/meta.json';
import getPath from 'lodash/fp/get';
import palettes from 'iwanthue/precomputed/k-means-fancy-light';
import {createWikipediaLabel} from '../lib/helpers';

const DEFAULT_PARSE_OPTIONS = {
  header: true,
  skipEmptyLines: true,
  dynamicTyping: true
};

const mapSeriesPoint = point => ({
  x: point.decade,
  y: point.count
});

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

  return createWikipediaLabel(previous.slice(0, offset) + suffix, false);
}

function getNames(url, callback) {
  console.time('names');

  return fetch(url)
    .then(response => response.arrayBuffer())
    .then(buffer => {
      console.time('names.zlib');
      const string = inflate(buffer, {to: 'string'});
      console.timeEnd('names.zlib');

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

class AssetsManager extends EventEmitter {
  constructor(baseUrl) {
    super();

    this.baseUrl = baseUrl;

    this.data = {
      names: null,
      series: {},
      top: null
    };

    meta.series.forEach(series => (this.data.series[series] = null));

    // Fetching data in advance
    this.get('top.csv.gz', (err, data) => {
      if (err) return console.error(err);

      this.data.top = data;
      this.emit('top', data);
    });

    // TODO: schedule async jobs to avoid freezing the UI
    // this.getNames('names.txt.gz', (err, data) => {
    //   if (err) return console.error(err);

    //   this.data.names = data;
    //   this.emit('names', data);
    // });

    meta.series.forEach(series => {
      this.get(`${series}_series.csv`, (err, data) => {
        if (err) return console.error(err);

        let i = 0;

        // Processing data
        if (series === 'default')
          data = [
            {
              id: 'default',
              color: palettes[2][0],
              data: data.map(mapSeriesPoint)
            }
          ];
        else
          data = map(
            groupBy(data, point => point.value),
            (points, value, groups) => {
              return {
                id: value,
                color: palettes[Object.keys(groups).length][i++],
                data: points.map(mapSeriesPoint)
              };
            }
          );

        this.data.series[series] = data;
        this.emit(`series.${series}`, data);
      });
    });
  }

  join(path) {
    return urljoin(this.baseUrl, path);
  }

  get(path, callback) {
    return get(this.join(path), callback);
  }

  getNames(path, callback) {
    return getNames(this.join(path), callback);
  }
}

const manager = new AssetsManager(BASE_URL);

export default manager;

export function useAsset(name) {
  // NOTE: it would be fairly easy to make asset downloading lazy by tweaking things here
  const [asset, setAsset] = useState(null);

  const data = getPath(name, manager.data);

  useEffect(() => {
    if (data) return;

    const listener = retrievedData => {
      setAsset(retrievedData);
    };

    manager.once(name, listener);

    return () => manager.off(name, listener);
  }, [name]);

  return {downloaded: !!data, data};
}
