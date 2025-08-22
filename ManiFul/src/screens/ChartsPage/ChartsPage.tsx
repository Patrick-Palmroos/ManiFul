import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import colors from '../../styles/colors';
import LineChart from './LineChart';
import { useTransactions } from '../../context/TransactionContext';
import LinearGradient from 'react-native-linear-gradient';
import { useEffect, useMemo, useState } from 'react';
import {
  isCurrentMonthAndYear,
  monthToTextFormat,
} from '../../utils/date_handling';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import text from '../../styles/text';
import MonthPicker from 'react-native-month-year-picker';
import IndicatorBar from './IndicatorBar';
import { useBudgets } from '../../context/BudgetContext';
import { useTypes } from '../../context/TypesContext';
import { BudgetType } from '../../types/budgets';
import PieChart from '../../components/PieChart/PieChart';
import { generateDescendingColors } from '../../utils/color_generation';
import { PieData } from '../../types/data';
import styles from './styles';

interface BudgetCategoryTypeValues {
  name: string;
  id: number;
  total: number;
  used: number;
  types: Types[];
}

interface Types {
  name: string;
  id: number;
  total: number;
}

const baseColors = [
  { hue: 0, saturation: 72, lightness: 62, hex: '#E45959' },
  { hue: 87, saturation: 100, lightness: 72, hex: '#BFFF71' },
  { hue: 210, saturation: 100, lightness: 76, hex: '#85C2FF' },
  { hue: 315, saturation: 100, lightness: 82, hex: '#FFA3E8' },
  { hue: 108, saturation: 67, lightness: 76, hex: '#a9eb98' },
];

const ChartsPage = () => {
  const { transactions } = useTransactions();
  const { categories } = useTypes();
  const { budgets } = useBudgets();
  const [date, setDate] = useState<Date>(new Date());
  const [editDate, setEditDate] = useState<boolean>(false);
  const [items, setItems] = useState<BudgetCategoryTypeValues[]>([]);
  const [largest, setLargest] = useState<{ name: string; total: number }[]>([]);
  const [currentDate] = useState<number>(new Date().getDate());
  const [pieData, setPieData] = useState<PieData[]>([]);

  console.log('transactions: ', transactions);
  console.log('budgets: ', budgets);
  console.log('categories: ', categories);

  const values = transactions.filter(t => {
    const d = new Date(t.date);
    const month = d.getMonth();
    const year = d.getFullYear();
    return month === date.getMonth() && year === date.getFullYear();
  });

  const { budget } = useMemo(() => {
    const newBudget: BudgetType | undefined = budgets.find(
      b => b.month === date.getMonth() + 1 && b.year === date.getFullYear(),
    );

    return { budget: newBudget };
  }, [date]);

  const handleJoiningItems = () => {
    //get all categories and their types
    const list: BudgetCategoryTypeValues[] = categories
      .map(cat => {
        // skip if the category isnt an expense
        if (!cat.expense) return null;

        return {
          name: cat.name,
          id: cat.id,
          total: 0,
          used: 0,
          types: cat.types.map(type => ({
            name: type.name,
            id: type.id,
            total: 0,
          })),
        };
      })
      .filter(i => i !== null);

    //check if budget even exists
    if (budget) {
      list.forEach(item => {
        item.total =
          budget.items.find(bi => bi.categoryId === item.id)?.amount || 0;
      });

      list.forEach(category => {
        category.types.forEach(type => {
          // for each transaction
          type.total = values.reduce((typeSum, transaction) => {
            // find items in transaction that match the type
            const matchingItems =
              transaction.items?.filter(item => item.type.id === type.id) || [];

            // sum only the amounts of the matching items
            const itemsTotal = matchingItems.reduce(
              (sum, item) => sum + item.total,
              0,
            );

            return typeSum + itemsTotal;
          }, 0);
        });

        // Calculate total used for the entire category
        category.used = category.types.reduce(
          (sum, type) => sum + type.total,
          0,
        );
      });
    }
    console.log(list);
    handleLargest(list);
    piedataHandling(list);
    setItems(list);
  };

  useEffect(() => {
    handleJoiningItems();
  }, [date]);

  const total = values.reduce((sum, v) => (sum += v.total), 0);

  const handleChange = (event: any, newDate?: Date) => {
    setEditDate(false);

    if (newDate) {
      setDate(newDate);
    }
  };

  const handleLargest = (list: BudgetCategoryTypeValues[]) => {
    const listOfAll: { name: string; total: number }[] = list
      .flatMap(l => {
        return l.types.map(type => {
          return { name: type.name, total: type.total };
        });
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
      .filter(i => i.total !== 0);

    console.log('list of all items:', listOfAll);
    setLargest(listOfAll);
  };

  const piedataHandling = (list: BudgetCategoryTypeValues[]) => {
    let globalIndex = 0;
    const totalItems = list.reduce((total, item) => {
      const filtered = item.types.filter(i => i.total !== 0);
      return total + filtered.length;
    }, 0);

    const newList = list.flatMap((item, i) => {
      const colors = generateDescendingColors({
        count: item.types.length,
        baseHue: baseColors[i].hue,
        baseSaturation: baseColors[i].saturation,
        startLightness: baseColors[i].lightness,
        step: 10,
      }).slice(1);

      const filteredAndSorted = item.types
        .sort((a, b) => b.total - a.total)
        .filter(i => i.total !== 0);

      const typesWithColors = filteredAndSorted.map((type, localIndex) => {
        const isLastItemGlobally = globalIndex === totalItems - 1;
        const result = {
          name: type.name,
          value: type.total,
          id: type.id,
          gap: isLastItemGlobally,
          color: colors[localIndex],
        };
        globalIndex++;
        return result;
      });

      return typesWithColors;
    });

    console.log('pie data!!!!: ', newList);
    setPieData(newList);
  };

  return (
    <ScrollView scrollEnabled style={styles.scrollView}>
      <TouchableWithoutFeedback>
        <View>
          {/* Container for line graph component */}
          <LinearGradient
            colors={[colors.highlight, '#5C438D']}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={styles.lineGraphContainer}>
            {/* Month and year wrapper */}
            <View style={styles.monthYearWrapper}>
              {/* Month wrapper */}
              <View style={styles.monthWrapper}>
                {/* Touchable opacity to be able to change date */}
                <TouchableOpacity
                  onPress={() => setEditDate(true)}
                  style={styles.changeDateButton}>
                  {/* Month text */}
                  <Text style={styles.monthText}>
                    {monthToTextFormat(date.getMonth())}
                  </Text>
                  {/* arrow container */}
                  <View style={styles.arrowContainer}>
                    <MaterialIcons
                      name={editDate ? 'arrow-drop-up' : 'arrow-drop-down'}
                      size={40}
                      color={'#ffffffff'}
                      style={styles.arrow}
                    />
                  </View>
                </TouchableOpacity>
                {/* Conditionally rendered button to reset date */}
                {!isCurrentMonthAndYear(
                  date.getMonth() + 1,
                  date.getFullYear(),
                ) && (
                  //reset button.
                  <TouchableOpacity
                    style={styles.resetButton}
                    onPress={() => setDate(new Date())}>
                    <Text style={text.regularLight}>Reset</Text>
                    <MaterialIcons
                      name={'cached'}
                      size={25}
                      color={'#ffffffff'}
                    />
                  </TouchableOpacity>
                )}
              </View>
              {/* Year text */}
              <Text style={styles.yearText}>{date.getFullYear()}</Text>
            </View>
            {/* Total container */}
            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>
                Total.{' '}
                <Text style={{ color: colors.moneyLight }}>
                  {total.toFixed(2)}€
                </Text>
              </Text>
            </View>
            {/* Line chart container */}
            <View style={styles.lineChartContainer}>
              <LineChart
                chartKey={`${date.getMonth()}-${date.getFullYear()}`}
                year={date.getFullYear()}
                month={date.getMonth() + 1}
                data={values}
                graphColor="#C0D7FF"
                graphColorSecondary="#681060"
                graphLineColor="#A8FFFE"
                textColor="#FFFFFF"
              />
            </View>
          </LinearGradient>
          {/* date editing modal. */}
          {editDate && date && (
            <MonthPicker
              value={date}
              onChange={handleChange}
              locale="en" // change to fi for finnish
            />
          )}
          {/* View for Indicator bars */}
          <View style={styles.indicatorsContainer}>
            {items.map((item, i) => (
              <View style={styles.indicator} key={i}>
                <IndicatorBar
                  total={item.total}
                  value={item.used}
                  title={item.name}
                  barKey={`${item.name + item.id}-${item.total}-${item.used}`}
                />
              </View>
            ))}
          </View>
          {/* View for largest expense and statistics */}
          <View style={styles.largestAndStatisticsContainer}>
            {/* Largest expenses */}
            <View style={styles.largestContainer}>
              <Text style={text.title}>Largest expenses</Text>
              {largest.map((item, i) => (
                <View key={i} style={styles.largestTextsContainer}>
                  <Text style={text.regularMedium}>{`${i + 1}.`}</Text>
                  <Text style={text.regular}>{item.name}</Text>
                  <Text style={styles.largestMoneyText}>{`${item.total.toFixed(
                    2,
                  )}€`}</Text>
                </View>
              ))}
            </View>
            {/* Statistics */}
            <View style={styles.statisticsContainer}>
              <View style={{ gap: 4 }}>
                <Text style={styles.statisticsText}>
                  {budget
                    ? `${((total / budget?.budgetTotal) * 100).toFixed(
                        2,
                      )}% of total monthly budget spent.`
                    : 'No budget selected'}
                </Text>
                <Text style={styles.statisticsText}>
                  {budget
                    ? `${(100 - (total / budget?.budgetTotal) * 100).toFixed(
                        2,
                      )}% of total budget left.`
                    : 'No budget selected'}
                </Text>
                <Text style={styles.statisticsText}>
                  {budget
                    ? `Average money spent per day: ${(
                        total / currentDate
                      ).toFixed(2)}€`
                    : 'No budget selected'}
                </Text>
              </View>
            </View>
          </View>
          {/* piecharts container */}
          <View style={styles.pieContainer}>
            <LinearGradient
              colors={[colors.highlight, '#5C438D']}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 1 }}
              style={styles.pieLinearGradient}>
              {/* PieChart wrapper */}
              <View style={styles.pieWrapper}>
                {pieData.length !== 0 ? (
                  items.map((item, i) => {
                    //if category has 0 spent then dont render it.
                    if (item.used === 0) return null;

                    return (
                      <View key={i} style={styles.pieTitleAndTotalContainer}>
                        {/* Item title wrapper */}
                        <View style={styles.pieTitleAndTotalWrapper}>
                          {/* title and ball wrapper */}
                          <View style={styles.pieTitleContainer}>
                            {/* title */}
                            <Text style={styles.pieTitle}>{item.name}</Text>
                            {/* color ball */}
                            <View
                              style={{
                                ...styles.titleColor,
                                backgroundColor: baseColors[i].hex || 'grey',
                              }}
                            />
                          </View>
                          {/* total and percentage display wrapper */}
                          <View style={styles.pieTotalContainer}>
                            {/* total used value */}
                            <Text style={styles.pieTotalText}>
                              {item.used.toFixed(2)}€
                            </Text>
                            {/* percentage value */}
                            <Text style={styles.piePercentage}>
                              {((item.used / item.total) * 100).toFixed(2)}%
                            </Text>
                          </View>
                        </View>
                        {/* category types */}
                        {item.types.map((type, i) => {
                          {
                            /* If type doesnt exist in piedata dont render it */
                          }
                          if (!pieData.find(p => p.id === type.id)) return null;

                          return (
                            // Wrapper for data color, name and values
                            <View
                              key={i}
                              style={styles.dataColorNameValuesWrapper}>
                              {/* Color and name wrapper */}
                              <View style={styles.dataColorNameWrapper}>
                                {/* Color */}
                                <View
                                  style={{
                                    backgroundColor: pieData.find(
                                      p => type.id === p.id,
                                    )?.color,
                                    ...styles.dataColor,
                                  }}
                                />
                                {/* name */}
                                <Text style={styles.dataName}>{type.name}</Text>
                              </View>
                              {/* Wrapper for values */}
                              <View style={styles.dataValuesWrapper}>
                                {/* Euro amount */}
                                <Text style={styles.dataEuroText}>
                                  {type.total.toFixed(2)}€
                                </Text>
                                {/* Percentage amount */}
                                <Text style={styles.dataPercentageText}>
                                  (
                                  {((type.total / item.total) * 100).toFixed(2)}
                                  %)
                                </Text>
                              </View>
                            </View>
                          );
                        })}
                      </View>
                    );
                  })
                ) : (
                  <View>
                    <Text style={text.regularLight}>No budget found</Text>
                  </View>
                )}
              </View>
              <View style={styles.pieChartWrapper}>
                {/* PieChart for category totals */}
                <PieChart
                  pie_rad={70}
                  data={
                    pieData.length !== 0
                      ? items
                          .map((item, i) => {
                            if (item.used === 0) return null;
                            return {
                              name: item.name,
                              value: item.used,
                              gap: true,
                              color: baseColors[i].hex,
                            };
                          })
                          .filter(i => i !== null)
                      : [
                          {
                            name: 'none',
                            value: 1,
                            gap: true,
                            color: '#9e9e9e',
                          },
                        ]
                  }
                />
                {/* PieChart for type totals */}
                <PieChart
                  pie_rad={70}
                  data={
                    pieData.length === 0
                      ? [
                          {
                            name: 'none',
                            value: 1,
                            gap: true,
                            color: '#9e9e9e',
                          },
                        ]
                      : pieData
                  }
                  gap_angle={0.08}
                />
              </View>
            </LinearGradient>
          </View>
          {/* Bottom padding. */}
          <View style={{ paddingBottom: 150 }} />
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};

export default ChartsPage;
