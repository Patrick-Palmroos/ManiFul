import { View, Text } from 'react-native';
import colors from '../../styles/colors';
import LineChart from './LineChart';
import { useTransactions } from '../../context/TransactionContext';
import { isCurrentMonthAndYear } from '../../utils/date_handling';
import { useState } from 'react';

const ChartsPage = () => {
  const { transactions } = useTransactions();
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1,
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear(),
  );

  const values = transactions.filter(t => {
    const d = new Date(t.date);
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    return month === selectedMonth && year === selectedYear;
  });

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <View
        style={{
          width: '100%',
          height: 250,
          backgroundColor: 'black',
          // padding: 5,
        }}>
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
    </View>
  );
};

export default ChartsPage;
