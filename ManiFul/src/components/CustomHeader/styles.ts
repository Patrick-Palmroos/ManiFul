import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';

const styles = StyleSheet.create({
  container: {
    height: 90,
    backgroundColor: colors.backgroundWarm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 20,
    paddingLeft: 10,
    paddingTop: 10,
  },
  image: {
    marginTop: 10,
    width: 70,
    height: 70,
  },
  iconContainer: {
    paddingTop: 10,
  },
});

export default styles;
