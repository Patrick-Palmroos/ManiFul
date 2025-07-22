import { ActivityIndicator, View } from 'react-native';
import { Text } from 'react-native-svg';

const LoadingScreen = () => {
  return (
    <View>
      <ActivityIndicator />
      <Text>Loading...</Text>
    </View>
  );
};

export default LoadingScreen;
