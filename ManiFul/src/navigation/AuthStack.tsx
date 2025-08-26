import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types/navigation';
import LoginPage from '../screens/LoginPage';
import Signup from '../screens/Signup';

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  return (
    <>
      <Stack.Screen name="login" component={LoginPage} />
      <Stack.Screen name="signup" component={Signup} />
    </>
  );
};

export default AuthStack;
