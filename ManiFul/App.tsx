//App.tsx
import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from "./src/types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>()

import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  useColorScheme,
} from 'react-native';

import {
  Colors,

} from 'react-native/Libraries/NewAppScreen';
import { NavigationContainer } from '@react-navigation/native';



function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='landingPage' screenOptions={{headerTitle: "", headerShown: false}}>
        <Stack.Screen name="landingPage" component={}/>
        <Stack.Screen name="login" component={}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});

export default App;
