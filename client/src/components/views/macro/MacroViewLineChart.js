/* eslint react/jsx-no-bind: 0 */
/**
 * BHHT Datascape Macro View Line Chart Component
 * ===============================================
 *
 * Line chart displaying the histogram's data.
 */
import React from 'react';
import {format} from 'd3-format';
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  Brush
} from 'recharts';

import palettes from '../../../palettes';

/**
 * Constants.
 */
const NUMBER_FORMAT = format(',');

/**
 * Main component.
 */
export default function MacroViewLineChart(props) {
  const {
    data: {values, names},
    dimensions,
    mode,
    period,
    onBrush
  } = props;

  const startIndex = values.findIndex(value => value.from === period[0]),
        endIndex = values.findIndex(value => value.from === period[1]);

  return (
    <LineChart
      width={dimensions.width}
      height={250}
      data={values}
      margin={{top: 5, right: 50, left: 50, bottom: 5}}>
      <XAxis
        dataKey="from" />
      <YAxis
        tickFormatter={NUMBER_FORMAT} />
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip isAnimationActive={false} />
      <Legend />
      {names.map((name, i) => {
        return (
          <Line
            key={name}
            dot={false}
            type="monotone"
            dataKey={name}
            stroke={palettes[mode][i]} />
        );
      })}
      <Brush
        dataKey="from"
        height={30}
        stroke="#ccc"
        startIndex={startIndex}
        endIndex={endIndex}
        onChange={range => {
          onBrush([
            values[range.startIndex].from,
            values[range.endIndex].from
          ]);
        }} />
    </LineChart>
  );
}
