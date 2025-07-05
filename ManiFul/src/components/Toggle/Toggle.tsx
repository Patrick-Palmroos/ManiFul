import { View, Text, TouchableOpacity } from 'react-native';
import styles from './styles';
import colors from '../../styles/colors';
import text from '../../styles/text';

interface ToggleProps {
  onValueChange: (value: boolean) => void;
  value: boolean;
  field1?: string;
  field2?: string;
}

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
