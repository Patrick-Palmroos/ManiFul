import { PieData } from '../../types/data';
import { View, Text } from 'react-native';
import text from '../../styles/text';
import styles from './styles';

const ChartPointList = ({ data }: { data: PieData[] }) => {
  return (
    <View style={{ display: 'flex', flexDirection: 'column' }}>
      {data.map((d, i) => (
        <View key={i} style={styles.container}>
          <View
            style={{
              ...styles.bulletPoint,
              backgroundColor: d.color,
            }}
          />
          <Text style={text.regular}>
            {d.name + '  '}
            <Text style={{ ...text.regular, color: '#4A4A4A' }}>
              {d.value}%
            </Text>
          </Text>
        </View>
      ))}
    </View>
  );
};

export default ChartPointList;
