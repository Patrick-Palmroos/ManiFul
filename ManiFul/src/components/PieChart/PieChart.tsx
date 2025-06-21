import { View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import * as d3Shape from 'd3-shape';

const gap_angle = 0.04;

const colors = ['#BECFCD', '#4D4D50', '#B8B8B6', '#E0CFB0', '#A67C52'];

const PieChart = ({ pie_rad, data }: { pie_rad: number; data: number[] }) => {
  const pieGenerator = d3Shape
    .pie<number>()
    .value(d => d)
    .padAngle(gap_angle)
    .sort((a, b) => b - a);

  const arcs = pieGenerator(data);

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
              fill={colors[index]}
            />
          ))}
        </G>
      </Svg>
    </View>
  );
};

export default PieChart;
