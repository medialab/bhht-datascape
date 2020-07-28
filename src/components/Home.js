import React, {useState} from 'react';
import {Range} from 'rc-slider';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import Series from './viz/Series';
import {useAsset} from '../assets';
import palettes from 'iwanthue/precomputed/k-means-colorblind';
import meta from '../../specs/meta.json';

const mapPoint = point => ({
  x: point.decade,
  y: point.count
});

const rangeMarks = {
  '-3500': '-3500',
  '-500': '-500',
  '0': '0',
  '1000': '1000',
  '1800': '1800',
  '2020': '2020'
};

export default function Home() {
  const [dateRange, setDateRange] = useState([meta.dates.min, meta.dates.max]);

  const series = useAsset('series.occupation');

  let seriesData = null;

  let i = 0;

  if (series.downloaded) {
    if (false)
      seriesData = [
        {
          id: 'default',
          color: palettes[2][0],
          data: series.data.map(mapPoint)
        }
      ];
    else
      seriesData = map(
        groupBy(series.data, point => point.value),
        (points, value, groups) => {
          return {
            id: value,
            color: palettes[Object.keys(groups).length][i++],
            data: points.map(mapPoint)
          };
        }
      );
  }

  return (
    <div>
      <Series range={dateRange} data={seriesData} />
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
  );
}
