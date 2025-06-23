import { View, Text } from 'react-native';
import { useEffect, useState } from 'react';
import { fetchTransactionWithid } from '../../api/userApi/transactionApi';

const HistoryPage = () => {
  const [test, setTest] = useState(null);

  useEffect(() => {
    const t = async () => {
      const res = await fetchTransactionWithid({ id: 1 });
      if (res) {
        setTest(res);
      } else {
        console.error('ERRROR FETCHING: ', res);
      }
    };

    t();
  }, []);

  if (!test) {
    return (
      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 50,
        }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>History</Text>
    </View>
  );
};

export default HistoryPage;
