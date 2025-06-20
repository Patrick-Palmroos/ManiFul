import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainStackParamList } from '../types/navigation';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from '../screens/HomePage';
import HistoryPage from '../screens/HistoryPage';
import ChartsPage from '../screens/ChartsPage';
import BudgetsPage from '../screens/BudgetsPage';
import ActionModal from '../screens/ActionModal';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import CustomTabBar from '../components/CustomTabBar/CustomTabBar';
import CustomHeader from '../components/CustomHeader/CustomHeader';
import ProfilePage from '../screens/ProfilePage';

const Stack = createNativeStackNavigator<MainStackParamList>();
const Tab = createBottomTabNavigator();

const TabNav = () => {
  return (
    <Tab.Navigator
      initialRouteName="home"
      screenOptions={{ headerShown: false }}
      tabBar={props => <CustomTabBar {...props} />}>
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
      <Tab.Screen
        name="history"
        component={HistoryPage}
        options={{ title: 'history' }}
      />
      <Tab.Screen
        name="action"
        component={ActionModal}
        options={{ title: 'action' }}
      />
      <Tab.Screen
        name="budgets"
        component={BudgetsPage}
        options={{ title: 'budgets' }}
      />
      <Tab.Screen
        name="charts"
        component={ChartsPage}
        options={{ title: 'charts' }}
      />
    </Tab.Navigator>
  );
};

const MainStack = () => {
  return (
    <>
      <Stack.Screen
        name="TabNav"
        component={TabNav}
        options={({ navigation }) => ({
          headerShown: true,
          header: () => <CustomHeader navigation={navigation} />,
        })}
      />
      <Stack.Screen
        name="profile"
        component={ProfilePage}
        options={{ headerShown: true, headerTitle: '' }}
      />
    </>
  );
};

export default MainStack;
