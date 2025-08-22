import { View, Text } from 'react-native';
import styles from './styles';

interface TooltipProps {
  visible: boolean;
  value: number;
  day: number;
  x: number;
  y: number;
}

const Tooltip = ({ visible, value, day, x, y }: TooltipProps) => {
  if (!visible) return null;

  return (
    <View style={[styles.tooltip, { left: x - 40, top: y - 60 }]}>
      <Text style={styles.tooltipText}>Day {day}</Text>
      <Text style={styles.tooltipValue}>{value.toFixed(2)}€</Text>
    </View>
  );
};

export default Tooltip;
