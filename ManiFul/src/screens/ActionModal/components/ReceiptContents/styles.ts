import { StyleSheet } from 'react-native';
import colors from '../../../../styles/colors';
import text from '../../../../styles/text';
import generalStyles from '../../../../styles/styles';

const styles = StyleSheet.create({
  vendorInput: {
    ...text.title,
    fontSize: 19,
    textDecorationLine: 'underline',
    textAlign: 'left',
    paddingVertical: 4,
    textAlignVertical: 'center',
  },
  dateEditButton: {
    backgroundColor: 'black',
    padding: 3,
    borderRadius: 8,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 10,
    paddingLeft: 5,
  },
  nameInputField: {
    ...generalStyles.textField,
    backgroundColor: colors.backgroundWarm,
    paddingLeft: 5,
    height: '80%',
    paddingBottom: 0,
    paddingTop: 0,
    width: '65%',
  },
  typeText: {
    ...text.moneyDark,
    color: colors.light,
    fontSize: 11,
    backgroundColor: colors.gradient,
    textAlign: 'center',
    width: 'auto',
    lineHeight: 14,
    borderRadius: 8,
    padding: 4,
    paddingRight: 5,
    paddingLeft: 5,
  },
  button: {
    padding: 5,
    borderRadius: 8,
    width: '45%',
  },
  popup: {
    position: 'absolute',
    backgroundColor: 'rgba(48, 48, 48, 1)',
    padding: 7,
    gap: 4,
    borderRadius: 8,
    elevation: 4,
  },
});

export default styles;
