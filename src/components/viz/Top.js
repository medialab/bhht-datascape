import React from 'react';
import debounce from 'react-debounce-render';
import Heap from 'mnemonist/heap';
import meta from '../../../specs/meta.json';

function comparator(a, b) {
  if (a.ranking < b.ranking) return 1;
  if (a.ranking > b.ranking) return -1;

  return 0;
}

export default debounce(function TopPeople({range, data}) {
  if (!data) return <div>...</div>;

  let top = data.filter(person => {
    return (
      person.birth >= range[0] &&
      (person.death === null ? meta.dates.max : person.death) <= range[1]
    );
  });

  top = Heap.nlargest(comparator, 100, top);

  console.log(top);

  return (
    <div>
      {range[0]} {range[1]}
    </div>
  );
}, 500);
