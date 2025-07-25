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
  },
  nameInputField: {
    ...generalStyles.textField,
    backgroundColor: '#dcdfebff',
    paddingLeft: 5,
    height: '80%',
    paddingBottom: 0,
    paddingTop: 0,
    width: '45%',
  },
  typeText: {
    ...text.moneyDark,
    color: colors.textDefault,
    fontSize: 14,
    backgroundColor: colors.backgroundWarm,
    textAlign: 'center',
    width: 'auto',
    borderRadius: 8,
    padding: 3,
  },
  button: {
    padding: 5,
    borderRadius: 8,
    width: '45%',
  },
});

export default styles;
