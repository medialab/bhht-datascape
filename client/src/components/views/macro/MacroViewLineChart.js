/* eslint react/jsx-no-bind: 0 */
/**
 * BHHT Datascape Macro View Line Chart Component
 * ===============================================
 *
 * Line chart displaying the histogram's data.
 */
import React, {Component} from 'react';
import {format} from 'd3-format';
import debounce from 'debounce';
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  Brush
} from 'recharts';

import LABELS from 'specs/labels.json';

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

    this.renderTooltip = this.renderTooltip.bind(this);
  }

  renderTooltip(data) {
    const payload = data.payload.slice().sort((a, b) => {
      return b.value - a.value;
    });

    const labels = LABELS[this.props.mode];

    const style = {
      margin: 0,
      padding: 10,
      backgroundColor: '#fff',
      border: '1px solid #ccc',
      whiteSpace: 'nowrap'
    };

    return (
      <div style={style}>
        <p className="recharts-tooltip-label">{LABEL_FORMAT(data.label)}</p>
        <ul>
          {payload.map(item => {
            return (
              <li key={item.name}>
                <span style={{color: item.color}}>{labels ? labels[item.name] : item.name}:</span> {NUMBER_FORMAT(item.value)}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  render() {
    const {
      data: {values, names, colors},
      dimensions,
      period
    } = this.props;

    const startIndex = values.findIndex(value => value.from === period[0]),
          endIndex = values.findIndex(value => value.to === period[1]);

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
          content={this.renderTooltip} />
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
