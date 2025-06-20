import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { enableScreens } from 'react-native-screens';
import MainStack from './MainStack';
import AuthStack from './AuthStack';

enableScreens();

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigation = () => {
  const isAuthenticated = true;
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {isAuthenticated ? MainStack() : AuthStack()}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigation;
