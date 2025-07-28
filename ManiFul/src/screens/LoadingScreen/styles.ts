import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundWarm,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '50%',
    height: '10%',
    marginBottom: 30,
    resizeMode: 'contain',
  },
});

export default styles;
