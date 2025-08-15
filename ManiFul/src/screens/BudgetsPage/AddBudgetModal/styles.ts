import { StyleSheet, ViewStyle } from 'react-native';
import colors from '../../../styles/colors';
import text from '../../../styles/text';
import defaultStyles from '../../../styles/styles';

const baseButton: ViewStyle = {
  padding: 10,
  width: 200,
  marginTop: 5,
  alignItems: 'center',
  borderRadius: 15,
  backgroundColor: colors.highlight,
};

const styles = StyleSheet.create({
  wrapper: { gap: 15 },
  totalWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
  },
  subTitleText: {
    ...text.regularSemiBold,
    fontSize: 18,
  },
  totalInput: {
    ...defaultStyles.textField,
    width: 120,
    height: 45,
  },
  totalEuroSign: {
    ...text.moneyDark,
    fontSize: 20,
    color: colors.highlight,
  },
  dateWrapper: {
    alignItems: 'center',
    marginTop: 10,
  },
  dateTextWrapper: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  changeDateButton: {
    ...baseButton,
  },
  buttonText: {
    ...text.regularSemiBold,
    color: colors.white,
    fontSize: 17,
  },
  allocationsWrapper: {
    marginTop: 20,
  },
  allocationTitle: {
    ...text.title,
    fontSize: 20,
  },
  allocationValuesWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  allocationsGeneralText: {
    ...text.regular,
    textAlign: 'center',
  },
  allocatedText: {
    ...text.moneyDark,
    fontSize: 18,
    color: colors.gradient,
  },
  unallocatedText: {
    ...text.moneyDark,
    fontSize: 18,
  },
  editAllocationsButton: {
    ...baseButton,
    width: '100%',
    marginTop: 10,
  },
  saveButtonWrapper: {
    marginTop: 30,
  },
});

export default styles;
