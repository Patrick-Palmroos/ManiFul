import { View, Text, TouchableOpacity } from 'react-native';
import colors from '../../styles/colors';
import LineChart from './LineChart';
import { useTransactions } from '../../context/TransactionContext';
import LinearGradient from 'react-native-linear-gradient';
import { useState } from 'react';
import { monthToTextFormat } from '../../utils/date_handling';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import text from '../../styles/text';
import MonthPicker from 'react-native-month-year-picker';

const ChartsPage = () => {
  const { transactions } = useTransactions();
  const [date, setDate] = useState<Date>(new Date());
  const [editDate, setEditDate] = useState<boolean>(false);

  const values = transactions.filter(t => {
    const d = new Date(t.date);
    const month = d.getMonth();
    const year = d.getFullYear();
    return month === date.getMonth() && year === date.getFullYear();
  });

  const handleChange = (event: any, newDate?: Date) => {
    setEditDate(false);

    if (newDate) {
      setDate(newDate);
    }
  };

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
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
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={() => setEditDate(true)}>
            <View
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
                  onPress={() => setEditDate(true)}
                  color={'#ffffffff'}
                  style={{
                    textAlign: 'center',
                    position: 'absolute',
                  }}
                />
              </View>
            </View>
          </TouchableOpacity>
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
      {editDate && date && (
        <MonthPicker
          value={date}
          onChange={handleChange}
          locale="en" // change to fi for finnish
        />
      )}
    </View>
  );
};

export default ChartsPage;
