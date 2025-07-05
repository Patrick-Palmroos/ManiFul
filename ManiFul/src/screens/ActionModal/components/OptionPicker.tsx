import { View, Text, Button } from 'react-native';

const OptionPicker = ({
  camera,
  gallery,
}: {
  camera: () => void;
  gallery: () => void;
}) => {
  return (
    <View>
      <Text>Lol</Text>
      <Button title="gallery" onPress={gallery} />
      <Button title="camera" onPress={camera} />
    </View>
  );
};

export default OptionPicker;
