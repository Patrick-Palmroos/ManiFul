import { View, Text, Button, ActivityIndicator } from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import text from '../../../../styles/text';
import colors from '../../../../styles/colors';

const ReceiptLoading = () => {
  return (
    <View
      style={{
        height: 150,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 20,
        }}>
        <ActivityIndicator
          size={90}
          color={colors.gradient}
          style={{ position: 'absolute' }}
        />
        <MaterialIcons name={'receipt'} size={30} color={colors.gradient} />
      </View>
      <Text style={{ ...text.regular, marginTop: 35 }}>
        Processing your receipt...
      </Text>
    </View>
  );
};

export default ReceiptLoading;
