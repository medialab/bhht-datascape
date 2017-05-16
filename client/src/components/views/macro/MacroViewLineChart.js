/* eslint react/jsx-no-bind: 0 */
/**
 * BHHT Datascape Macro View Line Chart Component
 * ===============================================
 *
 * Line chart displaying the histogram's data.
 */
import React, {Component} from 'react';
import {format} from 'd3-format';
import debounce from 'lodash/debounce';
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
export default class MacroViewLineChart extends Component {
  constructor(props, context) {
    super(props, context);

    this.debouncedOnBrush = debounce((...args) => {
      this.props.onBrush(...args);
    }, 500);
  }

  render() {
    const {
      data: {values, names, colors},
      dimensions,
      period
    } = this.props;

    const startIndex = values.findIndex(value => value.from === period[0]),
          endIndex = values.findIndex(value => value.from === period[1]);

    return (
      <LineChart
        syncId="macro"
        width={dimensions.width}
        height={250}
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
        {names.map((name, i) => {
          return (
            <Line
              key={name}
              dot={false}
              type="monotone"
              dataKey={name}
              stroke={colors[i]} />
          );
        })}
        <Brush
          dataKey="from"
          height={30}
          stroke="#ccc"
          startIndex={startIndex}
          endIndex={endIndex}
          onChange={range => {
            this.debouncedOnBrush([
              values[range.startIndex].from,
              values[range.endIndex].from
            ]);
          }} />
      </LineChart>
    );
  }
}
