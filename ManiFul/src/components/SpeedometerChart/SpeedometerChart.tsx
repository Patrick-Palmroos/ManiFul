import { View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import * as d3Shape from 'd3-shape';

type SpeedometerChartProps = {
  radius: number;
  used: number;
  total: number;
  backgroundColor?: string;
  fillColor?: string;
};

const SpeedometerChart = ({
  radius,
  used,
  total,
  backgroundColor = '#e6e6e6',
  fillColor = '#4CAF50',
}: SpeedometerChartProps) => {
  if (total <= 0) return null;

  const clamp = (val: number) => Math.max(0, Math.min(val, total));
  const usedClamped = clamp(used);
  const percentageUsed = usedClamped / total;

  const innerRadius = radius / 1.5;
  const outerRadius = radius;

  const arcGenerator = d3Shape
    .arc<d3Shape.DefaultArcObject>()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

  const startAngle = -Math.PI / 2;
  const endAngle = Math.PI / 2;

  // Full background semi-circle arc
  const fullArc: d3Shape.DefaultArcObject = {
    startAngle,
    endAngle,
    innerRadius,
    outerRadius,
    padAngle: 0,
  };

  // Used portion of the semi-circle
  const usedArc: d3Shape.DefaultArcObject = {
    startAngle,
    endAngle: startAngle + Math.PI * percentageUsed,
    innerRadius,
    outerRadius,
    padAngle: 0,
  };

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={radius * 2} height={radius}>
        <G x={radius} y={radius}>
          {/* Background */}
          <Path d={arcGenerator(fullArc) ?? ''} fill={backgroundColor} />
          {/* Used Part */}
          <Path d={arcGenerator(usedArc) ?? ''} fill={fillColor} />
        </G>
      </Svg>
    </View>
  );
};

export default SpeedometerChart;
