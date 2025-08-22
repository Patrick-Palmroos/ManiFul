import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';
import text from '../../styles/text';

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: colors.background,
  },
  lineGraphContainer: {
    width: '100%',
    paddingBottom: 15,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  monthYearWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  monthWrapper: {
    flexDirection: 'row',
  },
  changeDateButton: {
    height: 30,
    flexDirection: 'row',
    margin: 10,
    alignItems: 'center',
  },
  monthText: {
    ...text.regularMedium,
    color: colors.light,
    fontSize: 18,
  },
  arrowContainer: {
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  arrow: { textAlign: 'center', position: 'absolute' },
  resetButton: {
    marginLeft: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  yearText: {
    ...text.regularMedium,
    color: colors.light,
    fontSize: 14,
    height: 30,
    margin: 10,
    textAlign: 'center',
  },
  totalContainer: {
    height: 30,
    paddingLeft: 10,
  },
  totalText: {
    ...text.regularMedium,
    fontSize: 18,
    color: colors.light,
  },
  lineChartContainer: {
    height: 220,
  },
  indicatorsContainer: {
    backgroundColor: 'white',
    margin: 15,
    borderRadius: 15,
    padding: 10,
  },
  indicator: {
    height: 50,
  },
  largestAndStatisticsContainer: {
    flexDirection: 'row',
    gap: 5,
    justifyContent: 'center',
  },
  largestContainer: {
    backgroundColor: 'white',
    width: '45%',
    padding: 10,
    borderRadius: 15,
    height: '100%',
  },
  largestTextsContainer: {
    flexDirection: 'row',
    gap: 3,
    flexWrap: 'wrap',
    marginBottom: 5,
  },
  largestMoneyText: {
    ...text.moneyDark,
    marginLeft: 2,
    fontSize: 16,
  },
  statisticsContainer: {
    backgroundColor: 'white',
    height: '100%',
    width: '45%',
    padding: 10,
    borderRadius: 15,
  },
  statisticsText: {
    ...text.regular,
    fontSize: 15,
  },
  pieContainer: {
    margin: 20,
  },
  pieLinearGradient: {
    width: '100%',
    minHeight: 350,
    paddingBottom: 15,
    borderRadius: 20,
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
  },
  pieWrapper: {
    maxWidth: '50%',
  },
  pieTitleAndTotalContainer: {
    marginBottom: 10,
  },
  pieTitleAndTotalWrapper: {
    flexWrap: 'wrap',
    gap: 5,
  },
  pieTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pieTitle: {
    ...text.title,
    color: colors.light,
    fontSize: 18,
  },
  titleColor: {
    borderRadius: 35,
    marginLeft: 5,
    borderColor: colors.light,
    borderWidth: 1.2,
    height: 20,
    width: 20,
  },
  pieTotalContainer: {
    flexDirection: 'row',
    gap: 7,
    flexWrap: 'wrap',
    top: -10,
    height: 16,
  },
  pieTotalText: {
    ...text.moneyLight,
    fontSize: 16,
  },
  piePercentage: {
    ...text.regular,
    fontSize: 15,
    color: colors.light,
  },
  dataColorNameValuesWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 5,
  },
  dataColorNameWrapper: {
    flexDirection: 'row',
    gap: 3,
    alignItems: 'center',
  },
  dataColor: {
    width: 15,
    height: 15,
    borderRadius: 35,
    borderColor: colors.light,
    borderWidth: 1,
  },
  dataName: {
    ...text.regular,
    fontSize: 14,
    color: colors.light,
  },
  dataValuesWrapper: {
    marginLeft: 5,
    flexDirection: 'row',
    gap: 8,
  },
  dataEuroText: {
    ...text.moneyLight,
    fontSize: 13,
  },
  dataPercentageText: {
    ...text.regular,
    fontSize: 13,
    color: '#dbdbdbff',
  },
  pieChartWrapper: {
    justifyContent: 'space-evenly',
  },
});

export default styles;
