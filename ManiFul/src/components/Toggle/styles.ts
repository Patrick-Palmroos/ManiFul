import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';
import text from '../../styles/text';

const styles = StyleSheet.create({
  container: {
    height: 45,
    padding: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggle: {
    borderWidth: 1,
    borderColor: colors.highlight,
    width: '50%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {},
});

export default styles;
