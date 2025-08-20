import { View, Text, TouchableOpacity } from 'react-native';
import colors from '../../styles/colors';
import LineChart from './LineChart';
import { useTransactions } from '../../context/TransactionContext';
import LinearGradient from 'react-native-linear-gradient';
import { useState } from 'react';
import { monthToTextFormat } from '../../utils/date_handling';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import text from '../../styles/text';

const ChartsPage = () => {
  const { transactions } = useTransactions();
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1,
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear(),
  );
  const [editDate, setEditDate] = useState<boolean>(false);

  const values = transactions.filter(t => {
    const d = new Date(t.date);
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    return month === selectedMonth && year === selectedYear;
  });

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
        <View
          style={{
            height: 50,
            flexDirection: 'row',
            padding: 10,
            alignItems: 'center',
          }}>
          <Text
            style={{
              ...text.regularMedium,
              color: colors.light,
              fontSize: 18,
            }}>
            {monthToTextFormat(selectedMonth - 1)}
          </Text>
          <TouchableOpacity
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
              onPress={() => setEditDate(!editDate)}
              color={'#ffffffff'}
              style={{
                textAlign: 'center',
                position: 'absolute',
              }}
            />
          </TouchableOpacity>
        </View>
        <View style={{ height: 220 }}>
          <LineChart
            chartKey={`${selectedMonth}-${selectedYear}`}
            year={selectedYear}
            month={selectedMonth}
            data={values}
            graphColor="#C0D7FF"
            graphColorSecondary="#681060"
            graphLineColor="#A8FFFE"
            textColor="#FFFFFF"
          />
        </View>
      </LinearGradient>
    </View>
  );
};

export default ChartsPage;
