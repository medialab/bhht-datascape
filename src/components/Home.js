import React, {useState} from 'react';
import {Range} from 'rc-slider';
import Select, {components} from 'react-select';
import AsyncSelect from 'react-select/async';
import debounce from 'lodash/debounce';
import sortBy from 'lodash/sortBy';
import Series from './viz/Series';
import Top from './viz/Top';
import People from './People';
import SectionTitle from './SectionTitle';
import * as contents from './contents';
import {useAsset} from '../assets';
import {createWikipediaName, createWikipediaLabel} from '../../lib/helpers';
import meta from '../../specs/meta.json';

const MAX_SEARCH_RESULTS = 100;

const rangeMarks = {
  '-3500': '-3500',
  '-1000': '-1000',
  '-500': '-500',
  0: '0',
  500: '500',
  1000: '1000',
  1500: '1500',
  2020: '2020'
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

const createLoadOptions = (rankings, names) => {
  return debounce((inputValue, callback) => {
    let options = names.filter(name =>
      name.toLowerCase().includes(inputValue.toLowerCase())
    );

    // Sorting by rank
    options = sortBy(options, [o => rankings[o] || Infinity, o => o]);

    const tooManyOptions = options.length > MAX_SEARCH_RESULTS;

    if (tooManyOptions) options = options.slice(0, MAX_SEARCH_RESULTS);

    options = options.map(name => ({
      label: name,
      value: name,
      ranking: rankings[name]
    }));

    if (tooManyOptions) options.push({label: '...', value: '', disabled: true});
    console.log(inputValue, options);
    return callback(options);
  }, 500);
};

function SearchOption(props) {
  if (props.data.ranking)
    return (
      <strong style={{textDecoration: 'underline'}}>
        <components.Option {...props} />
      </strong>
    );

  return <components.Option {...props} />;
}

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

function useBlacklist(defaultBlacklist) {
  const [blackList, setBlackList] = useState(new Set(defaultBlacklist));

  const toggleBlackList = value => {
    if (blackList.has(value)) blackList.delete(value);
    else blackList.add(value);

    setBlackList(new Set(blackList));
  };

  const resetBlackList = () => blackList.clear();

  return [blackList, toggleBlackList, resetBlackList];
}

export default function Home() {
  const [dateRange, setDateRange] = useState([-1000, 1890]);
  const [selectedSeries, setSelectedSeries] = useState(seriesOptions[2]);
  const [blackList, toggleBlackList, resetBlackList] = useBlacklist([
    'Culture',
    'Other',
    'Leadership',
    'Sports/Games',
    'Missing'
  ]);
  const [selectedPeople, setSelectedPeople] = useState(null);

  const series = useAsset(`series.${selectedSeries.value}`);
  const topPeople = useAsset('top');
  const names = useAsset('names');

  const rankings = {};

  if (topPeople)
    topPeople.forEach(p => {
      rankings[createWikipediaLabel(p.name)] = p.ranking;
    });

  return (
    <div>
      <contents.Papers />
      <contents.About />
      <contents.Authors />
      <SectionTitle id="series">Time series</SectionTitle>
      <div className="columns">
        <div className="column is-3">
          <SeriesSelect
            selected={selectedSeries}
            onChange={option => {
              setSelectedSeries(option);
              resetBlackList();
            }}
          />
          <ul style={{marginTop: '15px'}}>
            {series &&
              series.map(line => {
                return (
                  <li
                    key={line.id}
                    style={{cursor: 'pointer', userSelect: 'none'}}>
                    <span
                      style={{
                        display: 'inline-block',
                        width: '12px',
                        height: '12px',
                        background: line.color
                      }}
                    />
                    &nbsp;
                    <span
                      style={{
                        textDecoration: blackList.has(line.id)
                          ? 'line-through'
                          : 'none',
                        color: blackList.has(line.id) ? 'grey' : 'black'
                      }}
                      onClick={() => {
                        if (
                          !blackList.has(line.id) &&
                          blackList.size === series.length - 1
                        )
                          return;
                        toggleBlackList(line.id);
                      }}>
                      {line.id === 'default' ? 'All' : line.id}
                    </span>
                  </li>
                );
              })}
          </ul>
          {selectedSeries.value !== 'default' && (
            <div
              style={{
                fontSize: '0.7em',
                textAlign: 'center',
                marginTop: '15px'
              }}>
              <em>You can click values to filter them in/out.</em>
            </div>
          )}
        </div>
        <div className="column is-9">
          <Series
            range={dateRange}
            data={
              series ? series.filter(line => !blackList.has(line.id)) : null
            }
          />
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
            isClearable
            isLoading={!names}
            isDisabled={!names}
            placeholder={names ? 'Search...' : 'Loading...'}
            noOptionsMessage={noOptionsMessage}
            loadOptions={createLoadOptions(rankings, names)}
            components={{Option: SearchOption}}
            onChange={o => {
              if (!o || o.value === null) setSelectedPeople(null);
              else setSelectedPeople(createWikipediaName(o.value));
            }}
            isOptionDisabled={option => option.disabled}
          />
        </div>
        <div className="column is-9">
          {selectedPeople ? (
            <People
              name={selectedPeople}
              onReset={() => setSelectedPeople(null)}
            />
          ) : (
            <Top
              range={dateRange}
              onSelect={setSelectedPeople}
              data={
                topPeople
                  ? topPeople.filter(
                      p => !blackList.has(p[selectedSeries.value])
                    )
                  : null
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
