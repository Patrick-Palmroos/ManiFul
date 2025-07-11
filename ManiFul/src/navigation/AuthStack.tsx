import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types/navigation';
import LoginPage from '../screens/LoginPage';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  return (
    <>
      <Stack.Screen name="login" component={LoginPage} />
    </>
  );
};

export default AuthStack;
