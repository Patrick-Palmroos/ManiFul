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
//baseHue: number;
//    baseSaturation: number;
//    startLightness: number;
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
  { hue: 0, saturation: 100, lightness: 80, hex: '#FF9898' },
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

  const piedataHandling = (): PieData[] => {
    let globalIndex = 0;
    const totalItems = items.reduce((total, item) => {
      const filtered = item.types.filter(i => i.total !== 0);
      return total + filtered.length;
    }, 0);

    const newList = items.flatMap((item, i) => {
      const colors = generateDescendingColors({
        count: item.types.length,
        baseHue: baseColors[i].hue,
        baseSaturation: baseColors[i].saturation,
        startLightness: baseColors[i].lightness,
        step: 10,
      });

      const filteredAndSorted = item.types
        .sort((a, b) => b.total - a.total)
        .filter(i => i.total !== 0);

      const typesWithColors = filteredAndSorted.map((type, localIndex) => {
        const isLastItemGlobally = globalIndex === totalItems - 1;
        const result = {
          name: type.name,
          value: type.total,
          gap: isLastItemGlobally,
          color: colors[localIndex],
        };
        globalIndex++;
        return result;
      });

      return typesWithColors;
    });

    console.log('pie data!!!!: ', newList);
    return newList;
  };

  return (
    <ScrollView
      scrollEnabled
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}>
      <TouchableWithoutFeedback>
        <View>
          {/* Container for line graph component */}
          <LinearGradient
            colors={[colors.highlight, '#5C438D']}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={{
              width: '100%',
              paddingBottom: 15,
              borderBottomRightRadius: 20,
              borderBottomLeftRadius: 20,
            }}>
            {/* Month and year wrapper */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              {/* Month wrapper */}
              <View style={{ flexDirection: 'row' }}>
                {/* Touchable opacity to be able to change date */}
                <TouchableOpacity
                  onPress={() => setEditDate(true)}
                  style={{
                    height: 30,
                    flexDirection: 'row',
                    margin: 10,
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      ...text.regularMedium,
                      color: colors.light,
                      fontSize: 18,
                    }}>
                    {monthToTextFormat(date.getMonth())}
                  </Text>
                  <View
                    style={{
                      height: 30,
                      width: 30,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginLeft: 5,
                    }}>
                    <MaterialIcons
                      name={editDate ? 'arrow-drop-up' : 'arrow-drop-down'}
                      size={40}
                      color={'#ffffffff'}
                      style={{
                        textAlign: 'center',
                        position: 'absolute',
                      }}
                    />
                  </View>
                </TouchableOpacity>
                {/* Conditionally rendered button to reset date */}
                {!isCurrentMonthAndYear(
                  date.getMonth() + 1,
                  date.getFullYear(),
                ) && (
                  <TouchableOpacity
                    style={{
                      marginLeft: 15,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 5,
                    }}
                    onPress={() => setDate(new Date())}>
                    <Text style={{ ...text.regularLight }}>Reset</Text>
                    <MaterialIcons
                      name={'cached'}
                      size={25}
                      color={'#ffffffff'}
                      style={{}}
                    />
                  </TouchableOpacity>
                )}
              </View>
              {/* Year text */}
              <Text
                style={{
                  ...text.regularMedium,
                  color: colors.light,
                  fontSize: 14,
                  height: 30,
                  margin: 10,
                  textAlign: 'center',
                }}>
                {date.getFullYear()}
              </Text>
            </View>
            {/* Total container */}
            <View style={{ height: 30, paddingLeft: 10 }}>
              <Text
                style={{
                  ...text.regularMedium,
                  fontSize: 18,
                  color: colors.light,
                }}>
                Total.{' '}
                <Text style={{ color: colors.moneyLight }}>
                  {total.toFixed(2)}€
                </Text>
              </Text>
            </View>
            {/* Line chart container */}
            <View style={{ height: 220 }}>
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
          <View
            style={{
              backgroundColor: 'white',
              margin: 15,
              borderRadius: 15,
              padding: 10,
            }}>
            {items.map((item, i) => (
              <View style={{ height: 50 }} key={i}>
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
          <View
            style={{ flexDirection: 'row', gap: 5, justifyContent: 'center' }}>
            {/* Largest expenses */}
            <View
              style={{
                backgroundColor: 'white',
                width: '45%',
                padding: 10,
                borderRadius: 15,
                height: '100%',
              }}>
              <Text style={text.title}>Largest expenses</Text>
              {largest.map((item, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: 'row',
                    gap: 3,
                    flexWrap: 'wrap',
                    marginBottom: 5,
                  }}>
                  <Text style={text.regularMedium}>{`${i + 1}.`}</Text>
                  <Text style={text.regular}>{item.name}</Text>
                  <Text
                    style={{
                      ...text.moneyDark,
                      marginLeft: 2,
                      fontSize: 16,
                    }}>{`${item.total.toFixed(2)}€`}</Text>
                </View>
              ))}
            </View>
            {/* Statistics */}
            <View
              style={{
                backgroundColor: 'white',
                height: '100%',
                width: '45%',
                padding: 10,
                borderRadius: 15,
              }}>
              <View style={{ gap: 4 }}>
                <Text style={{ ...text.regular, fontSize: 15 }}>
                  {budget
                    ? `${((total / budget?.budgetTotal) * 100).toFixed(
                        2,
                      )}% of total monthly budget spent.`
                    : 'No budget selected'}
                </Text>
                <Text style={{ ...text.regular, fontSize: 15 }}>
                  {budget
                    ? `${(100 - (total / budget?.budgetTotal) * 100).toFixed(
                        2,
                      )}% of total budget left.`
                    : 'No budget selected'}
                </Text>
                <Text style={{ ...text.regular, fontSize: 15 }}>
                  {budget
                    ? `Average money spent per day: ${(
                        total / currentDate
                      ).toFixed(2)}€`
                    : 'No budget selected'}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ margin: 20 }}>
            <LinearGradient
              colors={[colors.highlight, '#5C438D']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: '100%',
                height: 400,
                paddingBottom: 15,
                borderRadius: 20,
              }}>
              <PieChart
                pie_rad={70}
                data={items
                  .map((item, i) => {
                    if (item.used === 0) return null;
                    return {
                      name: item.name,
                      value: item.used,
                      gap: true,
                      color: baseColors[i].hex,
                    };
                  })
                  .filter(i => i !== null)}
              />
              <PieChart
                pie_rad={70}
                data={piedataHandling()}
                gap_angle={0.08}
              />
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
