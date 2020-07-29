import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {Range} from 'rc-slider';
import Select, {components} from 'react-select';
import AsyncSelect from 'react-select/async';
import debounce from 'lodash/debounce';
import Series from './viz/Series';
import Top from './viz/Top';
import {useAsset} from '../assets';
import meta from '../../specs/meta.json';

const rangeMarks = {
  '-3500': '-3500',
  '-1000': '-1000',
  '-500': '-500',
  '0': '0',
  '500': '500',
  '1000': '1000',
  '1500': '1500',
  '2020': '2020'
};

const seriesOptions = [
  {value: 'default', label: 'Global'},
  {value: 'gender', label: 'By gender'},
  {value: 'occupation', label: 'By occupation'}
];

const noOptionsMessage = ({inputValue}) => {
  if (!inputValue || inputValue.length < 3) return 'Type to search people.';

  return 'No results.';
};

const createLoadOptions = names => {
  return debounce((inputValue, callback) => {
    let options = names.filter(name => name.toLowerCase().includes(inputValue));

    const tooManyOptions = options.length > 25;

    if (tooManyOptions) options = options.slice(0, 25);

    options = options.map(name => ({
      label: name,
      value: name
    }));

    if (tooManyOptions) options.push({label: '...', value: '', disabled: true});

    return callback(options);
  }, 500);
};

function SeriesSelect({selected, onChange}) {
  return (
    <Select
      isClearable={false}
      isSearchable={false}
      options={seriesOptions}
      value={selected}
      onChange={onChange}
    />
  );
}

function SearchOption(props) {
  return (
    <Link to={'/p/' + props.value.replace(/\s/g, '_')} style={{color: 'black'}}>
      <components.Option {...props} />
    </Link>
  );
}

export default function Home() {
  const [dateRange, setDateRange] = useState([meta.dates.min, meta.dates.max]);
  const [selectedSeries, setSelectedSeries] = useState(seriesOptions[0]);

  const series = useAsset(`series.${selectedSeries.value}`);
  const topPeople = useAsset('top');
  const names = useAsset('names');

  return (
    <div>
      <div className="columns">
        <div className="column is-3">
          <SeriesSelect
            selected={selectedSeries}
            onChange={setSelectedSeries}
          />
          <ul style={{marginTop: '15px'}}>
            {series &&
              series.map(line => {
                return (
                  <li key={line.id}>
                    <span
                      style={{
                        display: 'inline-block',
                        width: '12px',
                        height: '12px',
                        background: line.color
                      }}
                    />
                    <span> {line.id === 'default' ? 'All' : line.id}</span>
                  </li>
                );
              })}
          </ul>
        </div>
        <div className="column is-9">
          <Series range={dateRange} data={series} />
          <div
            style={{
              marginLeft: '50px',
              marginRight: '30px',
              userSelect: 'none',
              marginTop: '15px'
            }}>
            <Range
              min={meta.dates.min}
              max={meta.dates.max}
              value={dateRange}
              onChange={setDateRange}
              step={10}
              marks={rangeMarks}
            />
          </div>
        </div>
      </div>

      <div className="columns">
        <div className="column is-3" style={{paddingTop: '40px'}}>
          <AsyncSelect
            isLoading={!names}
            placeholder="Search..."
            noOptionsMessage={noOptionsMessage}
            loadOptions={createLoadOptions(names)}
            components={{Option: SearchOption}}
            isOptionDisabled={option => option.disabled}
          />
        </div>
        <div className="column is-9">
          <h2 style={{marginTop: '20px', fontSize: '1.8em'}}>Top People</h2>
          <Top range={dateRange} data={topPeople} />
        </div>
      </div>
    </div>
  );
}
