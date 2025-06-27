import { StyleSheet } from 'react-native';
import colors from '../../../../styles/colors';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 60,
    justifyContent: 'center',
    borderRadius: 15,
    padding: 10,
    shadowColor: 'black',
    elevation: 2,
    backgroundColor: colors.light,
  },
});

export default styles;
