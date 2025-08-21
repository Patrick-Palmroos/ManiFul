import { useState } from 'react';
import { View, Text } from 'react-native';
import Svg, { G, Text as SvgText, Line, Circle, TSpan } from 'react-native-svg';
import colors from '../../../styles/colors';

interface IndicatorBarProps {
  total: number;
  value: number;
  barColor?: string;
  lineColor?: string;
  title?: string;
  errorColor?: string;
  barKey: string;
}

const IndicatorBar = ({
  total,
  value,
  barColor = '#89004E',
  lineColor = '#EC2C96',
  errorColor = '#970000ff',
  title = '',
  barKey,
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
    setLineValue(value < total ? (value / total) * paddedWidth : paddedWidth);
    //sets the component size.
    setSize({ height: paddedHeight, width: paddedWidth });
  };

  return (
    <View onLayout={onLayout} style={{ flex: 1 }} key={barKey}>
      <Svg width={size.width + paddingX} height={size.height + paddingY}>
        {/* number value */}
        <SvgText
          x={paddingX / 2}
          y={size.height - paddingY - 5}
          fontSize={14}
          fontFamily="Rubik-Medium"
          fill={barColor}>
          {title ? `${title}: ` : ''}
          <TSpan
            fill={value <= total ? colors.moneyDark : errorColor}
            fontSize={14}>
            {value.toFixed(2)}
          </TSpan>
          <TSpan fill={barColor} fontSize={14}>
            {` / ${total.toFixed(2)}€`}
          </TSpan>
        </SvgText>

        {/* percentage value */}
        <SvgText
          x={size.width - 10}
          y={size.height - paddingY - 5}
          fontSize={14}
          textAnchor="middle"
          fontFamily="Rubik-Medium"
          fill={value <= total ? barColor : errorColor}>
          {value !== 0 && total !== 0
            ? `${((value / total) * 100).toFixed(2)}%`
            : '0.00%'}
        </SvgText>

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
            stroke={value <= total ? lineColor : errorColor}
            strokeWidth="12"
            strokeLinecap="round"
          />
        )}
      </Svg>
    </View>
  );
};

export default IndicatorBar;
