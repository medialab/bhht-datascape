import React from 'react';
import {ResponsiveLine} from '@nivo/line';
import range from 'lodash/range';

const TIME_STEP = 250;

function getYearTicks(lines) {
  let min = Infinity,
      max = -Infinity;

  lines.forEach(line => {
    line.data.forEach(point => {
      if (point.x < min)
        min = point.x;
      if (point.x > max)
        max = point.x;
    });
  });

  return range(min, max, TIME_STEP);
}

// xScale={{
//   type: 'linear',
//   min: 0
// }}

export default function Series({data}) {
  const yearTicks = getYearTicks(data);

  return (
    <ResponsiveLine
      data={data}
      enablePoints={false}
      isInteractive
      enableCrosshair
      animate
      margin={{top: 10, right: 60, bottom: 50, left: 40}}
      curve="monotoneX"
      axisLeft={{
        orient: 'left',
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        format: '~s'
      }}
      axisBottom={{
        tickValues: yearTicks
      }}
      gridXValues={yearTicks} />
  );
}
