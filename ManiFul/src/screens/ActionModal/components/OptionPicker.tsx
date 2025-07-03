import { View, Text, Button } from 'react-native';

const OptionPicker = ({ callback }: { callback: () => void }) => {
  return (
    <View>
      <Text>Lol</Text>
      <Button title="gallery" onPress={callback} />
    </View>
  );
};

export default OptionPicker;
