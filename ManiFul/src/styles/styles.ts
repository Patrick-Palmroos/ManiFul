import { StyleSheet } from 'react-native';
import colors from './colors';

const styles = StyleSheet.create({
  textField: {
    borderWidth: 1.4,
    width: '100%',
    borderColor: colors.highlight,
    backgroundColor: colors.white,
    color: colors.textDefault,
    borderRadius: 5,
    fontSize: 16,
  },
  textFieldFocused: {
    borderWidth: 2.4,
  },
});

export default styles;
