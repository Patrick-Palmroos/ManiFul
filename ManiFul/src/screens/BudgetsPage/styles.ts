import { StyleSheet } from 'react-native';
import colors from '../../styles/colors';
import text from '../../styles/text';

const styles = StyleSheet.create({
  wrapper: { backgroundColor: colors.background, flex: 1, padding: 20 },
  topCardGradient: {
    height: 120,
    width: '100%',
    borderRadius: 15,
  },
  topCardWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '100%',
  },
  monthWrapper: {
    justifyContent: 'space-evenly',
    marginLeft: 10,
  },
  dateText: {
    ...text.regularSemiBold,
    color: colors.light,
    fontSize: 20,
  },
  amountText: {
    ...text.moneyLight,
    fontSize: 24,
    lineHeight: 24,
  },
  amountLeftText: {
    ...text.regularLight,
    color: colors.light,
    fontSize: 18,
  },
  editButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: colors.light,
    width: 130,
    height: 30,
    borderRadius: 8,
  },
  editButtonText: {
    ...text.regularMedium,
    color: '#861955',
  },
  speedometerWrapper: {
    position: 'relative',
    right: 10,
    justifyContent: 'center',
  },
  defaultBudgetWrapper: {
    backgroundColor: colors.light,
    width: '100%',
    marginTop: 10,
    borderRadius: 15,
    padding: 8,
  },
  defaultBudgetTitleAndTotalWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  defaultBudgetTitleAndTotal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  defaultBudggetTitle: {
    ...text.title,
    fontSize: 18,
  },
  defaultBudgetTitleIcon: {
    marginLeft: 5,
    marginBottom: 3,
  },
  defaultBudgetAllocationsWrapper: {
    marginTop: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    gap: 4,
  },
  defaultBudgetCategoryName: {
    ...text.regular,
    fontSize: 14,
    textAlign: 'center',
  },
  defaultAllocationTotalAndPercentage: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  defaultAllocationTotal: {
    ...text.moneyDark,
    fontSize: 14,
    textAlign: 'center',
  },
  defaultAllocationPercentage: {
    ...text.subtext,
    marginLeft: 3,
  },
  addBudgetWrapper: {
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default styles;
