import { View, Text, TouchableOpacity } from 'react-native';
import styles from './styles';
import colors from '../../styles/colors';
import text from '../../styles/text';

/**
 * Props for the Toggle component.
 *
 * @interface ToggleProps
 * @property {boolean} value - Current selected value. 'true' selects field2, 'false' selects field1.
 * @property {(value: boolean) => void} onValueChange - Callback when the toggle is changed.
 * @property {string} [field1] - Optional label for the first option. Default is "Option 1".
 * @property {string} [field2] - Optional label for the second option. Default is "Option 2".
 */
interface ToggleProps {
  onValueChange: (value: boolean) => void;
  value: boolean;
  field1?: string;
  field2?: string;
}

/**
 * A custom toggle switch that allows switching between two labeled options.
 *
 * @component
 * @param {ToggleProps} options - The props for the Toggle component.
 * @returns {JSX.Element} The rendered toggle component.
 */
const Toggle = (options: ToggleProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => options.onValueChange(false)}
        style={{
          ...styles.toggle,
          backgroundColor: !options.value ? colors.highlight : colors.white,
          borderStartEndRadius: 10,
          borderStartStartRadius: 10,
        }}>
        <Text
          style={{
            ...text.regular,
            color: options.value ? colors.textDefault : 'white',
          }}>
          {options.field1 ? options.field1 : 'Option 1'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => options.onValueChange(true)}
        style={{
          ...styles.toggle,
          backgroundColor: options.value ? colors.highlight : colors.white,
          borderEndEndRadius: 10,
          borderEndStartRadius: 10,
        }}>
        <Text
          style={{
            ...text.regular,
            color: !options.value ? colors.textDefault : colors.white,
          }}>
          {options.field2 ? options.field2 : 'Option 2'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Toggle;
