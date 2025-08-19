import { View, Text } from 'react-native';
import colors from '../../styles/colors';
import LineChart from './LineChart';

const ChartsPage = () => {
  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <View style={{ width: '100%' }}>
        <LineChart />
      </View>
    </View>
  );
};

export default ChartsPage;
