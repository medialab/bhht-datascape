import React from 'react';
import {ResponsiveLine} from '@nivo/line';
import ticks from 'lodash/range';
import commaNumber from 'comma-number';

const style = {
  height: '350px',
  backgroundColor: 'white',
  border: '1px dashed black'
};

function ceil10(n) {
  return Math.ceil(n / 10) * 10;
}

function SliceTooltip({slice}) {
  const year = slice.points[0].data.x;

  return (
    <div
      style={{
        background: 'white',
        padding: '9px 12px',
        border: '1px solid #ccc'
      }}>
      <div>Year: {year}</div>
      {slice.points.map(point => (
        <div
          key={point.id}
          style={{
            padding: '3px 0'
          }}>
          <span
            style={{
              display: 'inline-block',
              width: '12px',
              height: '12px',
              background: point.serieColor
            }}
          />
          <span> {point.serieId === 'default' ? 'All' : point.serieId}</span> •{' '}
          <strong>{commaNumber(point.data.yFormatted)}</strong>
        </div>
      ))}
    </div>
  );
}

export default function Series({data, range}) {
  if (!data) return <div style={style} />;

  var timeStep = ceil10((range[1] - range[0]) / 14);

  let yearTicks = ticks(range[0], range[1], timeStep || 10);

  if (range[1] - yearTicks[yearTicks.length - 1] <= timeStep / 2)
    yearTicks = yearTicks.slice(0, -1);

  yearTicks.push(range[1]);

  data = data.map(line => {
    return {
      ...line,
      data: line.data.filter(
        point => point.x >= range[0] && point.x <= range[1]
      )
    };
  });

  return (
    <div style={style}>
      <ResponsiveLine
        data={data}
        isInteractive
        enableSlices="x"
        sliceTooltip={SliceTooltip}
        enableCrosshair
        animate={false}
        margin={{top: 20, right: 30, bottom: 40, left: 50}}
        curve="monotoneX"
        lineWidth={1}
        colors={data.map(line => line.color)}
        enablePoints={false}
        axisLeft={{
          orient: 'left',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          format: '~s'
        }}
        xScale={{
          type: 'linear',
          min: range[0],
          max: range[1]
        }}
        axisBottom={{
          tickValues: yearTicks
        }}
        gridXValues={yearTicks}
      />
    </div>
  );
}
