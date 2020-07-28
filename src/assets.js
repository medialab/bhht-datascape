import Papa from 'papaparse';
import {inflate} from 'pako';

console.log(BASE_URL);

// Papa.parse('http://localhost:3000/top.csv.gz', {
//   download: true,
//   complete(results) {
//     console.log(results);
//   }
// });

console.time('gz')
fetch('http://localhost:3000/names.txt.gz')
  .then(response => response.arrayBuffer())
  .then(buffer => {
    const string = inflate(buffer, {to: 'string'});

    Papa.parse(string, {fastMode: true, complete: results => {
      console.timeEnd('gz');
      console.log(results);
    }});
  });
