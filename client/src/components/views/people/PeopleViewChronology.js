/**
 * BHHT Datascape People View Chronology Component
 * ================================================
 *
 * Just a X axis showing where the person lived.
 */
import React from 'react';
import {
  ScatterChart,
  XAxis,
  YAxis,
  Tooltip,
  Scatter
} from 'recharts';

export default function PeopleViewChronology(props) {
  const {
    dimensions,
    date
  } = props;

  const values = [{date: +date, y: 0}];

  return (
    <ScatterChart
      width={dimensions.width}
      height={100}
      margin={{top: 10, right: 0, bottom: 10, left: 0}}>
      <XAxis
        dataKey="date"
        domain={[-2200, 2017]}
        tickCount={25}
        interval="preserveStartEnd" />
      <YAxis
        dataKey="y"
        ticks={[]}
        domain={[0, 0]}
        height={0}
        hide />
      <Scatter data={values} fill="#c8567a" />
      <Tooltip />
    </ScatterChart>
  );
}
