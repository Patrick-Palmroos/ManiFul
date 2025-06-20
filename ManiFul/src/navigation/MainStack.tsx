import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainStackParamList } from '../types/navigation';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from '../screens/HomePage';

const Stack = createNativeStackNavigator<MainStackParamList>();
const Tab = createBottomTabNavigator();

const TabNav = () => {
  return (
    <Tab.Navigator
      initialRouteName="home"
      screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="home"
        component={HomePage}
        options={{ title: 'home' }}
      />
    </Tab.Navigator>
  );
};

const MainStack = () => {
  return (
    <>
      <Stack.Screen name="TabNav" component={TabNav} />
    </>
  );
};

export default MainStack;
