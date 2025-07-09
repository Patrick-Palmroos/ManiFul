import { View, Text, Button } from 'react-native';
import { ImageScanType } from '../../../../types/raspberry';

const ReceiptContents = ({ data }: { data: ImageScanType }) => {
  return (
    <View>
      <Text>{data.vendor}</Text>
      <Button title="cancel" onPress={() => null} />
      <Button title="save" onPress={() => null} />
    </View>
  );
};

export default ReceiptContents;
