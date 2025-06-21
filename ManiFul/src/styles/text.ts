import { StyleSheet } from 'react-native';
import colors from './colors';

const text = StyleSheet.create({
  regular: {
    fontFamily: 'Rubik-Regular',
    color: colors.textDefault,
    fontSize: 16,
  },
  regularLight: {
    fontFamily: 'Rubik-Regular',
    color: colors.white,
    fontSize: 16,
  },
  title: {
    fontFamily: 'Rubik-Medium',
    color: '#89004E',
    fontSize: 16,
  },
  subtext: {
    fontFamily: 'Rubik-Regular',
    color: '#4A4A4A',
    fontSize: 13,
  },
  moneyLight: {
    fontFamily: 'Rubik-Medium',
    color: colors.moneyLight,
    fontSize: 18,
  },
  moneyDark: {
    fontFamily: 'Rubik-Medium',
    color: colors.moneyDark,
    fontSize: 18,
  },
});

export default text;
