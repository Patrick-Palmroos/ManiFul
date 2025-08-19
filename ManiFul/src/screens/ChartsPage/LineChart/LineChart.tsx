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

  const paddingY = 20;
  const paddingX = 20;

  const daysInMonth: number = new Date(2025, 8, 0).getDate();
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

      if ((even && i & 1) || (!even && (i & 1) === 0)) continue;

      newList.push({ day: i, x: position });
    }
    console.log('setting new list of: ', newList);
    setPoints(newList);
  };

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
          <SvgText x={10} y={20} fill="black" fontSize="12">
            LineChart
          </SvgText>
          <Line
            x1={paddingX / 2}
            y1={size.height - paddingY / 2}
            x2={size.width + paddingX / 2}
            y2={size.height - paddingY / 2}
            stroke="red"
            strokeWidth="4.5"
          />
          {points.map((p, i) => (
            <G key={i}>
              <Circle
                cx={p.x + paddingX / 2}
                cy={size.height - paddingY / 2}
                r={4}
                fill={'blue'}
              />
              <SvgText
                x={p.x + paddingX / 2}
                y={size.height + paddingY / 2}
                fontSize={14}
                textAnchor="middle"
                fontFamily="Rubik-Medium"
                fill={'red'}>
                {p.day}
              </SvgText>
            </G>
          ))}
        </G>
      </Svg>
    </View>
  );
};

export default LineChart;
