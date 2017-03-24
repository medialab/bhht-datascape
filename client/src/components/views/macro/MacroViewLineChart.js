/**
 * BHHT Datascape Macro View Line Chart Component
 * ===============================================
 *
 * Line chart displaying the histogram's data.
 */
import React from 'react';
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line
} from 'recharts';

import palettes from '../../../palettes';

/**
 * Helpers.
 */
function convertHistogramData(data) {
  const firstHistogram = data[0].histogram;

  const values = new Array(firstHistogram.length);

  for (let i = 0, l = values.length; i < l; i++) {
    for (let j = 0, m = data.length; j < m; j++) {
      values[i] = values[i] || {from: firstHistogram[i].from};
      values[i][data[j].name] = data[j].histogram[i].count;
    }
  }

  return values;
}

/**
 * Main component.
 */
export default function MacroViewLineChart(props) {
  const {
    data
  } = props;

  const lines = convertHistogramData(data);

  return (
    <LineChart
      width={730}
      height={250}
      data={lines}
      margin={{top: 5, right: 30, left: 20, bottom: 5}}>
      <XAxis
        dataKey="from"
        type="category" />
      <YAxis />
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip />
      <Legend />
      {data.map((line, i) => {
        return (
          <Line
            key={line.name}
            dot={false}
            type="monotone"
            dataKey={line.name}
            stroke={palettes[5][i]} />
        );
      })}
    </LineChart>
  );
}
