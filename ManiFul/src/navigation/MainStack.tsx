import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import LoginPage from '../screens/LoginPage';

const Stack = createNativeStackNavigator<RootStackParamList>();

const MainStack = () => {
  return (
    <>
      <Stack.Screen name="login" component={LoginPage} />
    </>
  );
};

export default { MainStack };
