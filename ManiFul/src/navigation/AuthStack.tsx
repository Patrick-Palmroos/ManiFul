import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import LoginPage from '../screens/LoginPage';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AuthStack = () => {
  return (
    <>
      <Stack.Screen name="login" component={LoginPage} />
    </>
  );
};

export default { AuthStack };
