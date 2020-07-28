import React from 'react';
import debounce from 'react-debounce-render';
import Heap from 'mnemonist/heap';
import meta from '../../../specs/meta.json';
import {createWikipediaLabel} from '../../../lib/helpers';

function comparator(a, b) {
  if (a.ranking < b.ranking) return 1;
  if (a.ranking > b.ranking) return -1;

  return 0;
}

const containerStyle = {
  height: '400px',
  overflowY: 'scroll'
};

const itemStyle = {
  padding: '10px',
  backgroundColor: 'white',
  border: '1px dashed black',
  margin: '5px'
};

export default debounce(function TopPeople({range, data}) {
  if (!data) return <div style={containerStyle}>...</div>;

  // TODO: change this to range intersection
  let top = data.filter(person => {
    return (
      person.birth >= range[0] &&
      (person.death === null ? meta.dates.max : person.death) <= range[1]
    );
  });

  top = Heap.nlargest(comparator, 100, top);

  return (
    <div>
      <ul style={containerStyle}>
        {top.map(person => {
          return (
            <li key={person.wikidata_code} style={itemStyle}>
              {createWikipediaLabel(person.name, false)}
            </li>
          );
        })}
      </ul>
    </div>
  );
}, 500);
