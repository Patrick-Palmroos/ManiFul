import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainStackParamList } from '../types/navigation';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from '../screens/HomePage';
import MaterialIcons from '@react-native-vector-icons/material-icons';

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
        options={{
          title: 'home',
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="home" color={color} size={size} />
          ),
        }}
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
