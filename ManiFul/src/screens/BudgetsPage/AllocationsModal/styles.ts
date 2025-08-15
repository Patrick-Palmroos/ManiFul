import { StyleSheet, Dimensions } from 'react-native';
import colors from '../../../styles/colors';
import text from '../../../styles/text';
import defaultStyles from '../../../styles/styles';
import Slider from '@react-native-community/slider';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  wrapper: { height: screenHeight * 0.7 },
  toggleWrapper: {
    alignItems: 'center',
  },
  actionButtonsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
  buttonStyle: {
    backgroundColor: colors.gradient,
    padding: 5,
    borderRadius: 15,
    width: screenWidth * 0.35,
  },
  buttonText: {
    ...text.regularLight,
    textAlign: 'center',
  },
  informationsWrapper: {
    marginTop: 20,
    paddingBottom: 10,
  },
  allocationInfoWrapper: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  allocationsWrapper: {
    maxHeight: screenHeight * 0.45,
  },
  scrollView: { marginBottom: 20 },
  allocationsView: {
    flex: 1,
    marginBottom: 20,
    marginTop: 10,
  },
  allocationItemWrapper: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  allocationNameAndValue: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  allocationValueText: {
    ...text.subtext,
    lineHeight: 16,
    fontSize: 14,
  },
  sliderAndLockWrapper: {
    flexDirection: 'row',
    width: screenWidth * 0.5,
  },
  slider: {
    width: screenWidth * 0.45,
  },
  textFieldsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textFieldStyle: {
    ...defaultStyles.textField,
    width: screenWidth * 0.22,
    height: 45,
  },
  saveButton: {
    backgroundColor: colors.confirmButton,
    padding: 6,
    borderRadius: 15,
  },
  saveButtonText: {
    ...text.regularLight,
    fontSize: 18,
    textAlign: 'center',
  },
});

export default styles;
