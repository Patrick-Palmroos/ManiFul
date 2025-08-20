import {
  View,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import Svg, { G, Text as SvgText, Line, Circle } from 'react-native-svg';
import { useState } from 'react';
import { TransactionData } from '../../../types/data';
import { isCurrentMonthAndYear } from '../../../utils/date_handling';
import Tooltip from '../ToolTip';

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

/**
 * A line chart component that visualizes transaction data over a month
 *
 * @component
 * @example
 * <LineChart
 *   data={transactionData}
 *   chartKey="monthly-revenue"
 *   month={3}
 *   year={2024}
 *   graphColor="#2b3547ff"
 *   graphColorSecondary="#868686ff"
 *   graphLineColor="#020069ff"
 *   textColor="#1b1b1bff"
 * />
 *
 * @param {Object} props - Component properties
 * @param {TransactionData[]} props.data - Array of transaction data objects
 * @param {string} props.chartKey - Unique key for the chart (used for re rendering the component)
 * @param {number} props.month - The month to display (1-12)
 * @param {number} props.year - The year to display
 * @param {string} [props.graphColor='#2b3547ff'] - Primary color for chart elements (axes and grid lines)
 * @param {string} [props.graphColorSecondary='#868686ff'] - Secondary color for chart
 * @param {string} [props.graphLineColor='#020069ff'] - Color for the data line and points
 * @param {string} [props.textColor='#1b1b1bff'] - Color for text labels
 *
 * @returns {React.ReactElement} A responsive SVG line chart component
 *
 * @remarks
 * This component displays transaction data aggregated by day for a specific month and year.
 *
 * The chart automatically scales to show values from 0 to the nearest multiple of 10 above the maximum value,
 * with a minimum range of 0-100.
 *
 * @see {@link TransactionData} for the data structure format
 * @see {@link isCurrentMonthAndYear} for the current month detection logic
 * @author Patrick Palmroos
 */
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
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipData, setTooltipData] = useState<{
    value: number;
    day: number;
    x: number;
    y: number;
  } | null>(null);

  //convert given data to LineChartValues.
  const filtered: LineChartValues[] = data.map((item: TransactionData) => {
    const date = new Date(item.date);
    return {
      date: date.getDate(),
      value: item.total,
    };
  });
  const map = new Map<number, number>();

  //map the values.
  for (const item of filtered) {
    map.set(item.date, (map.get(item.date) || 0) + item.value);
  }

  //create a merged array with same date items marged together.
  const merged = Array.from(map, ([date, value]) => ({ date, value }));

  //an array of only the values.
  const val = merged.map(merged => merged.value);
  //gets the highest value from val.
  const highestValue = Math.round(Math.max(...val) / 10.0 + 1) * 10.0;
  //sets a maximum value.
  const maxValue: number = highestValue > 100 ? highestValue : 100;

  //padding values
  const paddingY = 20;
  const leftPadding = 38;
  const rightPadding = 15;
  const paddingX = leftPadding + rightPadding;

  //the amount of days in a month and the current day.
  const daysInMonth: number = new Date(year, month, 0).getDate();
  const currentDay: number = new Date().getDate();

  // Called when the component renders. Gets the height and width available and calculates padding.
  const onLayout = (event: any) => {
    const { height, width } = event.nativeEvent.layout;
    const paddedWidth = width - paddingX;
    const paddedHeight = height - paddingY;

    setDots(paddedWidth);
    handleWaypoints(paddedHeight);
    setSize({ height: paddedHeight, width: paddedWidth });
  };

  // Sets the horizontal gridline values and their locations on the X axes.
  const setDots = (width: number) => {
    let newList: { x: number; day: number; hidden: boolean }[] = [];
    const interval = width / daysInMonth;
    let position = 0;

    //Checks if the months final day is even or odd.
    let even = true;
    if (daysInMonth & 1) {
      even = false;
    }
    //Creates the new list.
    for (let i = 1; i <= daysInMonth; i++) {
      position += interval;
      let hidden = false;

      if ((even && i & 1) || (!even && (i & 1) === 0)) {
        hidden = true;
      }

      newList.push({ day: i, x: position, hidden: hidden });
    }

    setPoints(newList);
  };

  // Sets the lines that help in reading what value a line represents along their labels.
  const handleWaypoints = (height: number) => {
    let newList: { y: number; value: number }[] = [];
    const interval = height / 5;
    for (let i = 0; i <= 4; i++) {
      newList.push({ y: interval * i, value: maxValue * (i / 4) });
    }

    setWaypoints(newList);
  };

  //handle presses to show the tooltip
  const handleDataPointPress = (
    jointTotal: number,
    day: number,
    x: number,
    y: number,
  ) => {
    setTooltipData({
      value: jointTotal,
      day: day,
      x: x + leftPadding,
      y: scaleY(jointTotal) + 15,
    });
    setTooltipVisible(true);

    // Auto-hide after 3 seconds
    setTimeout(() => {
      setTooltipVisible(false);
    }, 10000);
  };

  // Handle press outside to close the tooltip
  const handleBackgroundPress = () => {
    setTooltipVisible(false);
  };

  //origin point on X axes.
  const originX = leftPadding;
  //origin point on Y axes.
  const originY = size.height - paddingY / 2;

  //The point where the current day is.
  const todayPoint = points.find(p => p.day === currentDay);

  // gets the chart height
  const chartHeight =
    waypoints.length !== 0 ? waypoints[waypoints.length - 1].y : 0;
  //To get the Y axes scale for graph values.
  const scaleY = (value: number) => originY - (value / maxValue) * chartHeight;

  //Check for if the component is ready yet.
  const isReady =
    size.width > 0 &&
    size.height > 0 &&
    points.length > 0 &&
    waypoints.length > 0;

  return (
    <TouchableWithoutFeedback onPress={handleBackgroundPress}>
      <View
        key={chartKey}
        style={{
          flex: 1,
          height: size.height + paddingY,
        }}
        onLayout={onLayout}>
        {/* Tooltip */}
        {tooltipVisible && tooltipData && (
          <Tooltip
            visible={tooltipVisible}
            value={tooltipData.value}
            day={tooltipData.day}
            x={tooltipData.x}
            y={tooltipData.y}
          />
        )}

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
                    {wp.value
                      .toString()
                      .concat(wp.value === maxValue ? '€' : '')}
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
                          onPress={() =>
                            handleDataPointPress(
                              jointTotal,
                              p.day,
                              p.x,
                              scaleY(jointTotal) + 3,
                            )
                          }
                        />
                        <Circle
                          cx={p.x + leftPadding}
                          cy={scaleY(jointTotal) + 3}
                          r={4.25}
                          opacity={1}
                          fill={graphLineColor}
                          onPress={() =>
                            handleDataPointPress(
                              jointTotal,
                              p.day,
                              p.x,
                              scaleY(jointTotal) + 3,
                            )
                          }
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
            {/* Loading indicator */}
            <ActivityIndicator color={graphColor} size={50} />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default LineChart;
