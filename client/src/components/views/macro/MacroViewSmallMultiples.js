/* eslint react/jsx-no-bind: 0 */
/**
 * BHHT Datascape Macro View Small Multiples Component
 * ====================================================
 *
 * Component displaying small multiples for each of the histograms.
 */
import React from 'react';
import {pure} from 'recompose';
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
const NUMBER_FORMAT = format(','),
      RATIO_FORMAT = format('.4f');

/**
 * Main component.
 */
export default pure(function MacroViewSmallMultiples(props) {
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
            height={100}
            data={slice}
            margin={{top: 5, right: 50, left: 50, bottom: 5}}>
            <XAxis
              dataKey="from" />
            <YAxis
              domain={[0, 1]}
              tickFormatter={NUMBER_FORMAT}
              ticks={[0, 0.5, 1]}
              interval={0} />
            <CartesianGrid strokeDasharray="3 3" />
            <Area
              dot={false}
              name={name}
              type="monotone"
              dataKey={point => (point[name] / point.sum) || null}
              stroke={palettes[mode][i]}
              fill={palettes[mode][i]}
              isAnimationActive={false}
              animationDuration={0} />
            <Tooltip
              isAnimationActive={false}
              formatter={RATIO_FORMAT} />
          </AreaChart>
        );
      })}
    </div>
  );
});
