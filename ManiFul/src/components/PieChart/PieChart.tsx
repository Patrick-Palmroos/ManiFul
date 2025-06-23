import { View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import * as d3Shape from 'd3-shape';
import { PieData } from '../../types/data';

const gap_angle = 0.04;

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
 * <PieChart pie_rad={100} data={[30, 20, 50]} />
 */
const PieChart = ({ pie_rad, data }: { pie_rad: number; data: PieData[] }) => {
  // Create pie layout with custom padding and sorting
  const pieGenerator = d3Shape
    .pie<number>()
    .value(d => d)
    .padAngle(gap_angle)
    .sort((a, b) => b - a);

  const arcs = pieGenerator(data.map(d => d.value));

  // Create arc generator for path drawing
  const arcGenerator = d3Shape
    .arc<d3Shape.PieArcDatum<number>>()
    .outerRadius(pie_rad)
    .innerRadius(pie_rad / 1.75);

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={pie_rad * 2} height={pie_rad * 2}>
        <G x={pie_rad} y={pie_rad}>
          {arcs.map((arc, index) => (
            <Path
              key={`arc-${index}`}
              d={arcGenerator(arc) as string}
              fill={
                data[index]?.color
                  ? data[index].color
                  : colors[index % colors.length]
              }
            />
          ))}
        </G>
      </Svg>
    </View>
  );
};

export default PieChart;
