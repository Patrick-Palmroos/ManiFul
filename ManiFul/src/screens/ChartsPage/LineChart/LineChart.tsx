import { View, Text } from 'react-native';
import Svg, { G, Path, Text as SvgText, Line, Circle } from 'react-native-svg';
import * as d3Shape from 'd3-shape';
import { useState } from 'react';

const values = [
  { date: 9, value: 15 },
  { date: 3, value: 31 },
  { date: 1, value: 5 },
];

const LineChart = () => {
  const val = values.map(v => v.value);
  const highestValue = Math.round(Math.max(...val) / 10.0 + 1) * 10.0;
  const maxValue: number = highestValue > 100 ? highestValue : 100;
  const [size, setSize] = useState<{ height: number; width: number }>({
    height: 100,
    width: 100,
  });
  const [points, setPoints] = useState<{ x: number; day: number }[]>([]);
  const [waypoints, setWaypoints] = useState<{ y: number; value: number }[]>(
    [],
  );

  const paddingY = 20;
  const leftPadding = 38;
  const rightPadding = 15;
  const paddingX = leftPadding + rightPadding;

  const daysInMonth: number = new Date(2025, 9, 0).getDate();
  const currentDay: number = new Date().getDate();

  console.log(maxValue);
  console.log('days: ', daysInMonth);
  console.log('current day: ', currentDay);

  const onLayout = (event: any) => {
    const { height, width } = event.nativeEvent.layout;
    const paddedWidth = width - paddingX;
    const paddedHeight = height - paddingY;
    console.log('h and w:', paddedHeight, paddedWidth);
    setDots(paddedWidth);
    handleWaypoints(paddedHeight);
    setSize({ height: paddedHeight, width: paddedWidth });
  };

  const setDots = (width: number) => {
    let newList: { x: number; day: number }[] = [];
    const interval = width / daysInMonth;
    let position = 0;
    let even = true;
    if (daysInMonth & 1) {
      even = false;
    }
    console.log('interval of: ', interval);
    console.log('even: ', even);
    for (let i = 1; i <= daysInMonth; i++) {
      position += interval;

      if ((even && i & 1) || (!even && (i & 1) === 0)) {
        newList.push({ day: -1, x: position });
        continue;
      }

      newList.push({ day: i, x: position });
    }
    console.log('setting new list of: ', newList);
    setPoints(newList);
  };

  const handleWaypoints = (height: number) => {
    let newList: { y: number; value: number }[] = [];
    const interval = height / 5;
    let position = 0;
    let multiplication = 0;
    for (let i = 0; i < 5; i++) {
      newList.push({ y: position, value: maxValue * multiplication });
      position += interval;
      multiplication += 0.25;
    }
    console.log('waypoints: ', newList);

    setWaypoints(newList);
  };

  const originX = leftPadding;
  const originY = size.height - paddingY / 2;

  return (
    <View
      style={{
        flex: 1,
        height: size.height + paddingY,
        //margin: 10,
        backgroundColor: 'pink',
      }}
      onLayout={onLayout}>
      <Svg width={size.width + paddingX} height={size.height + paddingY}>
        <G>
          {/* the guiding lines and their values */}
          {waypoints.map((wp, i) => (
            <G key={i}>
              <SvgText
                x={wp.value === maxValue ? originX + 14 : originX - 6}
                y={
                  wp.value === maxValue
                    ? originY - wp.y - 10
                    : originY - wp.y + 4
                }
                textAnchor="end"
                fontFamily="Rubik-Medium"
                fill={'black'}
                fontSize="10">
                {wp.value.toString().concat(wp.value === maxValue ? '€' : '')}
              </SvgText>
              <Line
                x1={originX}
                y1={originY - wp.y}
                x2={size.width + leftPadding}
                y2={originY - wp.y}
                stroke="orange"
                strokeWidth="4.5"
                strokeLinecap="round"
              />
            </G>
          ))}
          {/* Vertical line */}
          <Line
            x1={originX}
            y1={originY}
            x2={originX}
            y2={paddingY + 12}
            stroke="red"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          {/* Horizontal line */}
          <Line
            x1={originX}
            y1={originY}
            x2={size.width + leftPadding}
            y2={originY}
            stroke="red"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          {/* Dots on horizontal line */}
          {points.map((p, i) => (
            <G key={i}>
              <Circle cx={p.x + leftPadding} cy={originY} r={4} fill={'blue'} />
              {p.day !== -1 && (
                <SvgText
                  x={p.x + leftPadding}
                  y={size.height + paddingY / 2}
                  fontSize={14}
                  textAnchor="middle"
                  fontFamily="Rubik-Medium"
                  fill={'red'}>
                  {p.day}
                </SvgText>
              )}
            </G>
          ))}
        </G>
      </Svg>
    </View>
  );
};

export default LineChart;
