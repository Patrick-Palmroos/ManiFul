import { StyleSheet, ViewStyle } from 'react-native';
import colors from '../../../styles/colors';
import text from '../../../styles/text';

const baseButton: ViewStyle = {
  width: 40,
  height: 40,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 10,
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.light,
    margin: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 15,
  },
  deleteAndEditWrapper: {
    flexDirection: 'row',
    gap: 10,
  },
  deleteButton: {
    ...baseButton,
    backgroundColor: colors.cancelButton,
  },
  editButton: {
    ...baseButton,
    backgroundColor: colors.highlight,
  },
});

export default styles;
