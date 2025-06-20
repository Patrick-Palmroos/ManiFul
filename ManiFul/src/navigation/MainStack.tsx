import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainStackParamList } from '../types/navigation';
import HomePage from '../screens/HomePage';

const Stack = createNativeStackNavigator<MainStackParamList>();

const MainStack = () => {
  return (
    <>
      <Stack.Screen name="home" component={HomePage} />
    </>
  );
};

export default MainStack;
