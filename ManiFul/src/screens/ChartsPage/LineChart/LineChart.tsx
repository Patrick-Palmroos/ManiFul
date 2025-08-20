import { View, Text, ActivityIndicator } from 'react-native';
import Svg, { G, Path, Text as SvgText, Line, Circle } from 'react-native-svg';
import * as d3Shape from 'd3-shape';
import { useEffect, useState } from 'react';
import { TransactionData } from '../../../types/data';
import { isCurrentMonthAndYear } from '../../../utils/date_handling';

interface LineChartValues {
  date: number;
  value: number;
}

interface LineChartProps {
  data: TransactionData[];
  chartKey: string;
  month: number;
  year: number;
  graphColor?: string;
  graphColorSecondary?: string;
  graphLineColor?: string;
  textColor?: string;
}

const LineChart = ({
  data,
  chartKey,
  year,
  month,
  graphColor = '#2b3547ff',
  graphColorSecondary = '#868686ff',
  graphLineColor = '#020069ff',
  textColor = '#1b1b1bff',
}: LineChartProps) => {
  const filtered: LineChartValues[] = data.map((item: TransactionData) => {
    const date = new Date(item.date);
    return {
      date: date.getDate(),
      value: item.total,
    };
  });
  const map = new Map<number, number>();

  for (const item of filtered) {
    map.set(item.date, (map.get(item.date) || 0) + item.value);
  }

  const merged = Array.from(map, ([date, value]) => ({ date, value }));

  const val = merged.map(merged => merged.value);
  const highestValue = Math.round(Math.max(...val) / 10.0 + 1) * 10.0;
  const maxValue: number = highestValue > 100 ? highestValue : 100;
  const [size, setSize] = useState<{ height: number; width: number }>({
    height: 0,
    width: 0,
  });
  const [points, setPoints] = useState<
    { x: number; day: number; hidden: boolean }[]
  >([]);
  const [waypoints, setWaypoints] = useState<{ y: number; value: number }[]>(
    [],
  );

  const paddingY = 20;
  const leftPadding = 38;
  const rightPadding = 15;
  const paddingX = leftPadding + rightPadding;

  const daysInMonth: number = new Date(year, month, 0).getDate();
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
    let newList: { x: number; day: number; hidden: boolean }[] = [];
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
      let hidden = false;

      if ((even && i & 1) || (!even && (i & 1) === 0)) {
        hidden = true;
      }

      newList.push({ day: i, x: position, hidden: hidden });
    }
    console.log('setting new list of: ', newList);
    setPoints(newList);
  };

  const handleWaypoints = (height: number) => {
    let newList: { y: number; value: number }[] = [];
    const interval = height / 5;
    for (let i = 0; i <= 4; i++) {
      newList.push({ y: interval * i, value: maxValue * (i / 4) });
    }
    console.log('waypoints: ', newList);

    setWaypoints(newList);
  };

  const originX = leftPadding;
  const originY = size.height - paddingY / 2;

  const todayPoint = points.find(p => p.day === currentDay);

  const chartHeight =
    waypoints.length !== 0 ? waypoints[waypoints.length - 1].y : 0;
  const scaleY = (value: number) => originY - (value / maxValue) * chartHeight;

  //Check for if the component is ready yet.
  const isReady =
    size.width > 0 &&
    size.height > 0 &&
    points.length > 0 &&
    waypoints.length > 0;

  return (
    <View
      key={chartKey}
      style={{
        flex: 1,
        height: size.height + paddingY,
      }}
      onLayout={onLayout}>
      {isReady ? (
        <Svg width={size.width + paddingX} height={size.height + paddingY}>
          <G>
            {/* the guiding lines and their values */}
            {waypoints.map((wp, i) => (
              <G key={i}>
                <SvgText
                  x={wp.value === maxValue ? originX + 15 : originX - 6}
                  y={
                    wp.value === maxValue
                      ? originY - wp.y - 10
                      : originY - wp.y + 4
                  }
                  textAnchor="end"
                  fontFamily="Rubik-Medium"
                  fill={textColor}
                  fontSize={wp.value === maxValue ? '11' : '10'}>
                  {wp.value.toString().concat(wp.value === maxValue ? '€' : '')}
                </SvgText>
                <Line
                  x1={originX}
                  y1={originY - wp.y}
                  x2={size.width + leftPadding}
                  y2={originY - wp.y}
                  stroke={graphColorSecondary}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </G>
            ))}
            {/* Current day line */}
            {isCurrentMonthAndYear(month, year) && todayPoint && (
              <Line
                x1={todayPoint.x + leftPadding}
                y1={originY - 10}
                x2={todayPoint.x + leftPadding}
                y2={paddingY}
                stroke={textColor}
                strokeWidth={2}
                strokeDasharray="7"
                //strokeLinecap="round"
              />
            )}
            {/* Vertical line */}
            <Line
              x1={originX}
              y1={originY}
              x2={originX}
              y2={paddingY + 12}
              stroke={graphColor}
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Horizontal line */}
            <Line
              x1={originX}
              y1={originY}
              x2={size.width + leftPadding}
              y2={originY}
              stroke={graphColor}
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Dots on horizontal line */}
            {points.map((p, i) => {
              const v = filtered.filter(v => v.date === p.day);
              let jointTotal: number = 0;
              if (v.length !== 0) {
                jointTotal = v.reduce((sum, v) => (sum += v.value), 0);
              }
              console.log(`filtered = ${v}, jointTotal: ${jointTotal}`);
              return (
                <G key={i}>
                  {/* Line for the date position */}
                  <Line
                    x1={p.x + leftPadding}
                    y1={originY - 5}
                    x2={p.x + leftPadding}
                    y2={originY + 7}
                    strokeWidth="2"
                    strokeLinecap="round"
                    stroke={graphColor}
                  />
                  {/* date text */}
                  {!p.hidden && (
                    <SvgText
                      x={p.x + leftPadding}
                      y={size.height + paddingY / 1.8}
                      fontSize={12}
                      textAnchor="middle"
                      fontFamily="Rubik-Medium"
                      fill={textColor}>
                      {String(p.day).padStart(2, '0')}
                    </SvgText>
                  )}
                  {/* Value for amount */}
                  {jointTotal !== 0 && (
                    <G>
                      <Line
                        x1={p.x + leftPadding}
                        y1={originY - 1.5}
                        x2={p.x + leftPadding}
                        y2={scaleY(jointTotal) + 3}
                        stroke={graphLineColor}
                        strokeWidth="8.5"
                        strokeLinecap="butt"
                      />
                      <Circle
                        cx={p.x + leftPadding}
                        cy={scaleY(jointTotal) + 3}
                        r={4.25}
                        opacity={1}
                        fill={graphLineColor}
                      />
                    </G>
                  )}
                </G>
              );
            })}
          </G>
        </Svg>
      ) : (
        <View style={{ justifyContent: 'center', height: '100%' }}>
          <ActivityIndicator color={graphColor} size={50} />
        </View>
      )}
    </View>
  );
};

export default LineChart;
