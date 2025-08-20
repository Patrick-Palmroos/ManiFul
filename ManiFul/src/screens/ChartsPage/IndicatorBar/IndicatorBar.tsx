import { useState } from 'react';
import { View, Text } from 'react-native';
import Svg, { G, Text as SvgText, Line, Circle } from 'react-native-svg';

const total = 1000;
const value = 300;

const IndicatorBar = () => {
  const [size, setSize] = useState<{ height: number; width: number }>({
    height: 0,
    width: 0,
  });
  const hello = 'World';

  const paddingY = 10;
  const paddingX = 20;

  const onLayout = (event: any) => {
    const { height, width } = event.nativeEvent.layout;
    const paddedWidth = width - paddingX;
    const paddedHeight = height - paddingY;

    setSize({ height: paddedHeight, width: paddedWidth });
  };

  return (
    <View onLayout={onLayout} style={{ flex: 1 }}>
      <Text>{hello}</Text>
      <Svg
        width={size.width + paddingX}
        height={size.height + paddingY}
        style={{
          backgroundColor: 'pink',
        }}>
        {/* whole bar */}
        <Line
          x1={paddingX / 2}
          y1={size.height - paddingY / 2}
          x2={size.width + paddingX / 2}
          y2={size.height - paddingY / 2}
          stroke={'red'}
          strokeWidth="15"
          strokeLinecap="round"
        />
        {/* progress bar */}
        <Line
          x1={paddingX / 2}
          y1={size.height - paddingY / 2}
          x2={200}
          y2={size.height - paddingY / 2}
          stroke={'yellow'}
          strokeWidth="15"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
};

export default IndicatorBar;
