import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topView: {
    width: '100%',
    flex: 1,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 25,
  },
  contentView: {
    flex: 4,
    marginTop: -25,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 20,
    backgroundColor: colors.background,
  },
});

export default styles;
