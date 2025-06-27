import { StyleSheet } from 'react-native';
import colors from '../../../../styles/colors';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    borderRadius: 15,
    padding: 10,
    backgroundColor: colors.light,
  },
});

export default styles;
