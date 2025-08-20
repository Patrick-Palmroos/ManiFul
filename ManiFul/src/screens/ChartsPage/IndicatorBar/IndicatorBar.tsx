import { useState } from 'react';
import { View, Text } from 'react-native';
import Svg, { G, Text as SvgText, Line, Circle } from 'react-native-svg';

interface IndicatorBarProps {
  total: number;
  value: number;
  barColor?: string;
  lineColor?: string;
}

const IndicatorBar = ({
  total,
  value,
  barColor = '#89004E',
  lineColor = '#EC2C96',
}: IndicatorBarProps) => {
  const [size, setSize] = useState<{ height: number; width: number }>({
    height: 0,
    width: 0,
  });
  const [lineValue, setLineValue] = useState<number>(0);

  const paddingY = 10;
  const paddingX = 20;

  const onLayout = (event: any) => {
    const { height, width } = event.nativeEvent.layout;
    const paddedWidth = width - paddingX;
    const paddedHeight = height - paddingY;

    //calculates the value for the progress bar.
    setLineValue((value / total) * paddedWidth);
    //sets the component size.
    setSize({ height: paddedHeight, width: paddedWidth });
  };

  return (
    <View onLayout={onLayout} style={{ flex: 1 }}>
      <Svg width={size.width + paddingX} height={size.height + paddingY}>
        {/* whole bar */}
        <Line
          x1={paddingX / 2}
          y1={size.height - paddingY / 2}
          x2={size.width + paddingX / 2}
          y2={size.height - paddingY / 2}
          stroke={barColor}
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* progress bar */}
        {lineValue !== 0 && (
          <Line
            x1={paddingX / 2}
            y1={size.height - paddingY / 2}
            x2={lineValue + paddingX / 2}
            y2={size.height - paddingY / 2}
            stroke={lineColor}
            strokeWidth="12"
            strokeLinecap="round"
          />
        )}
      </Svg>
    </View>
  );
};

export default IndicatorBar;
