import { View } from 'react-native';
import Svg, { G, Path, Text as SvgText } from 'react-native-svg';
import * as d3Shape from 'd3-shape';
import { PieData } from '../../types/data';

const colors = ['#BECFCD', '#4D4D50', '#B8B8B6', '#E0CFB0', '#A67C52'];

/**
 * Renders a pie chart using `react-native-svg` and `d3-shape`.
 *
 * @component
 * @param {Object} props - Props for the PieChart component.
 * @param {number} props.pie_rad - The radius of the pie chart.
 * @param {number[]} props.data - Array of numbers for the chart slices.
 * @returns {JSX.Element} The rendered pie chart.
 *
 * @example
 * <PieChart
 *   pie_rad={100}
 *   data={[
 *     {name: 'A', value: 30, gap: true},
 *     {name: 'B', value: 20, gap: false},
 *     {name: 'C', value: 50, gap: true}
 *   ]}
 * />
 */
const PieChart = ({
  pie_rad,
  data,
  gap_angle = 0.04,
}: {
  pie_rad: number;
  data: PieData[];
  gap_angle?: number;
}) => {
  const values = data.map(item => item.value);
  const gapInfo = data.map(item => item.gap || false);
  const colorsInfo = data.map(item => item.color);

  // Create pie generator
  const pieGenerator = d3Shape
    .pie<number>()
    .value(d => d)
    .padAngle(gap_angle) // Apply gap to all slices
    .sort(null);

  const customArcGenerator = d3Shape
    .arc<d3Shape.PieArcDatum<number>>()
    .outerRadius(pie_rad)
    .innerRadius(pie_rad / 1.75)
    .padAngle(0); // No gap

  const arcs = pieGenerator(values);

  // Create arc generator
  const arcGenerator = d3Shape
    .arc<d3Shape.PieArcDatum<number>>()
    .outerRadius(pie_rad)
    .innerRadius(pie_rad / 1.75);

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={pie_rad * 2} height={pie_rad * 2}>
        <G x={pie_rad} y={pie_rad}>
          {arcs.map((arc, index) => {
            // For slices that shouldn't have gaps, manually adjust
            // by creating a custom arc without padding
            if (!gapInfo[index]) {
              return (
                <Path
                  key={`arc-${index}`}
                  d={customArcGenerator(arc) as string}
                  fill={
                    colorsInfo[index]
                      ? colorsInfo[index]
                      : colors[index % colors.length]
                  }
                />
              );
            }

            return (
              <Path
                key={`arc-${index}`}
                d={arcGenerator(arc) as string}
                fill={
                  colorsInfo[index]
                    ? colorsInfo[index]
                    : colors[index % colors.length]
                }
              />
            );
          })}

          {/* Center text */}
          <SvgText
            textAnchor="middle"
            alignmentBaseline="middle"
            fontSize={pie_rad / 5.5}
            fontFamily="Rubik-Medium"
            fill="white">
            {`${values.reduce((sum, v) => (sum += v), 0).toFixed(2)}€`}
          </SvgText>
        </G>
      </Svg>
    </View>
  );
};

export default PieChart;
