import React from 'react';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import Series from './viz/Series';
import {useAsset} from '../assets';
import palettes from 'iwanthue/precomputed/k-means-colorblind';

const mapPoint = point => ({
  x: point.decade,
  y: point.count
});

export default function Home() {
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
      ]
    else
      seriesData = map(groupBy(series.data, point => point.value), (points, value, groups) => {
        return {
          id: value,
          color: palettes[Object.keys(groups).length][i++],
          data: points.map(mapPoint)
        };
      });
  }

  return (
    <div>
      <div style={{height: '400px'}}>
      {series.downloaded && <Series data={seriesData} />}
      </div>
    </div>
  );
}
