/**
 * BHHT Datascape Location View Frequentation Chart Component
 * ===========================================================
 *
 * Component displaying a location's frequentation data.
 */
import React from 'react';
import {format} from 'd3-format';
import palettes from '../../../palettes';
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  Brush
} from 'recharts';

/**
 * Constants.
 */
const NUMBER_FORMAT = format(',');
const LABEL_FORMAT = label => `Year ${label}`;

/**
 * Main component.
 */
export default function LocationViewFrequentationChart(props) {
  const {
    dimensions,
    values
  } = props;

  return (
    <LineChart
      width={dimensions.width}
      height={150}
      data={values}
      margin={{top: 5, right: 50, left: 50, bottom: 5}}>
      <XAxis
        dataKey="from" />
      <YAxis
        tickFormatter={NUMBER_FORMAT} />
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip
        isAnimationActive={false}
        formatter={NUMBER_FORMAT}
        labelFormatter={LABEL_FORMAT} />
      <Line
        dot={false}
        type="monotone"
        dataKey="count"
        stroke={palettes.global[0]} />
      <Brush
        dataKey="from"
        height={30}
        stroke="#ccc" />
    </LineChart>
  );
}
