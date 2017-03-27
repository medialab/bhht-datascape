/* eslint react/jsx-no-bind: 0 */
/**
 * BHHT Datascape Macro View Small Multiples Component
 * ====================================================
 *
 * Component displaying small multiples for each of the histograms.
 */
import React from 'react';
import {format} from 'd3-format';
import {
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area
} from 'recharts';

import palettes from '../../../palettes';

/**
 * Constants.
 */
const NUMBER_FORMAT = format(',');

/**
 * Main component.
 */
export default function MacroViewSmallMultiples(props) {
  const {
    data: {values, names},
    dimensions,
    mode,
    period
  } = props;

  const startIndex = values.findIndex(value => value.from === period[0]),
        endIndex = values.findIndex(value => value.from === period[1]);

  const slice = values.slice(startIndex, endIndex + 1);

  return (
    <div>
      {names.map((name, i) => {
        return (
          <AreaChart
            key={name}
            syncId="macro-small-multiples"
            width={dimensions.width}
            height={150}
            data={slice}
            margin={{top: 5, right: 50, left: 50, bottom: 5}}>
            <XAxis
              dataKey="from" />
            <YAxis
              domain={[0, 1]}
              tickFormatter={NUMBER_FORMAT} />
            <CartesianGrid strokeDasharray="3 3" />
            <Area
              dot={false}
              type="monotone"
              dataKey={point => (point[name] / point.sum) || null}
              stroke={palettes[mode][i]}
              fill={palettes[mode][i]} />
            <Tooltip isAnimationActive={false} />
          </AreaChart>
        );
      })}
    </div>
  );
}
