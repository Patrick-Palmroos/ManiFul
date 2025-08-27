import {
  Text,
  View,
  Button,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useEffect, useState, useMemo } from 'react';
import * as Keychain from 'react-native-keychain';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import { HomePageNavigationProp } from '../../types/navigation';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { UserCredentials } from 'react-native-keychain';
import colors from '../../styles/colors';
import styles from '../HomePage/styles';
import text from '../../styles/text';
import PieChart from '../../components/PieChart/PieChart';
import ChartPointList from '../../components/ChartPointList';
import { useBudgets } from '../../context/BudgetContext';
import { useTypes } from '../../context/TypesContext';
import { useTransactions } from '../../context/TransactionContext';
import { BudgetType } from '../../types/budgets';

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
  { hue: 264, saturation: 72, lightness: 62, hex: '#9159e4' },
];

const HomePage = () => {
  const { transactions } = useTransactions();
  const { categories } = useTypes();
  const { budgets } = useBudgets();
  const [items, setItems] = useState<BudgetCategoryTypeValues[]>([]);
  const [date] = useState<Date>(new Date());

  const screenWidth = Dimensions.get('window').width;
  const chartRadius = screenWidth * 0.18;

  const values = transactions.filter(t => {
    const d = new Date(t.date);
    const month = d.getMonth();
    const year = d.getFullYear();
    return month === date.getMonth() && year === date.getFullYear();
  });

  const total = values.reduce((sum, v) => (sum += v.total), 0);

  const { budget } = useMemo(() => {
    const newBudget: BudgetType | undefined = budgets.find(
      b => b.month === date.getMonth() + 1 && b.year === date.getFullYear(),
    );

    return { budget: newBudget };
  }, [transactions, categories, budgets]);

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
    setItems(list);
  };

  useEffect(() => {
    handleJoiningItems();
  }, [transactions, categories, budgets]);

  console.log('iotems: ', items);

  return (
    <ScrollView style={styles.container}>
      <View>
        {/* Displays the money left for the month */}
        <LinearGradient
          colors={[colors.highlight, colors.gradient]}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          style={styles.topView}>
          <Text style={{ ...text.regularLight, lineHeight: 20 }}>
            Left for the month:
          </Text>
          <Text style={{ ...text.moneyLight, fontSize: 36, lineHeight: 50 }}>
            {budget ? budget.budgetTotal - total : '0.00'}€
          </Text>
          <Text style={{ ...text.regularLight, fontSize: 14, lineHeight: 20 }}>
            <Text style={{ ...text.moneyLight, fontSize: 14, lineHeight: 20 }}>
              {budget
                ? ((total / budget.budgetTotal) * 100).toFixed(2)
                : '0.00'}
              %
            </Text>{' '}
            of the monthly budget spent.
          </Text>
        </LinearGradient>
        {/* View for the data */}
        <View style={styles.contentView}>
          {/* View for the data items */}
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 20,
              flexWrap: 'wrap',
            }}>
            {/* View for the data blocks ontop of each other */}
            <View
              style={{
                width: '45%',
                //height: 300,
                justifyContent: 'space-between',
              }}>
              {/* Total spending */}
              <View
                style={{
                  backgroundColor: 'white',
                  borderRadius: 20,
                  padding: 10,
                  //width: '45%',
                  height: 100,
                }}>
                {budget ? (
                  <View>
                    {/* Title */}
                    <Text style={text.title}>Total spending</Text>
                    {/* total used */}
                    <Text style={{ ...text.moneyDark, lineHeight: 18 }}>
                      {total}
                      {'€ '}
                      <Text
                        style={{
                          color: colors.highlight,
                        }}>
                        /
                      </Text>
                    </Text>
                    {/* total budget */}
                    <Text
                      style={{
                        ...text.regular,
                        color: colors.highlight,
                        fontSize: 18,
                      }}>
                      {budget?.budgetTotal}€
                    </Text>
                  </View>
                ) : (
                  <View>
                    <Text style={text.regular}>No budget found</Text>
                  </View>
                )}
              </View>
              {/* Item 2 */}
              <View
                style={{
                  backgroundColor: 'white',
                  borderRadius: 20,
                  //width: '45%',
                  height: 150,
                }}></View>
            </View>
            {/* PieChart View */}
            <View
              style={{
                backgroundColor: 'white',
                padding: 12,
                borderRadius: 20,
                //display: 'flex',

                //height: 300,
                width: '45%',
                //justifyContent: 'center',
              }}>
              <PieChart
                pie_rad={chartRadius}
                textColor="black"
                data={
                  items.filter(item => item.used !== 0).length !== 0
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
              {/* Dots with names and values */}
              <View style={{ marginTop: 5 }}>
                {items.length !== 0
                  ? items.map((item, i) => {
                      if (item.used === 0) return null;

                      return (
                        <View
                          key={i}
                          style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                          }}>
                          <View
                            style={{
                              backgroundColor: baseColors[i].hex,
                              height: 16,
                              width: 16,
                              borderRadius: 34,
                            }}
                          />
                          <Text
                            style={{
                              ...text.regular,
                              fontSize: 15,
                              marginLeft: 4,
                            }}>
                            {item.name}
                          </Text>
                          <Text
                            style={{
                              marginLeft: 4,
                              ...text.moneyDark,
                              fontSize: 15,
                            }}>
                            {item.used.toFixed(2)}€
                          </Text>
                        </View>
                      );
                    })
                  : null}
              </View>
              <View style={{ marginLeft: 20, marginTop: 20 }}></View>
            </View>
          </View>
        </View>
        <View style={{ marginTop: 50 }} />
      </View>
    </ScrollView>
  );
};

export default HomePage;
