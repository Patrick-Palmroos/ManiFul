//types/navigation.ts
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  login: undefined;
  home: undefined;
  // Add other screens here
};

export type LoginPageNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'login'
>;

export type HomePageNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'home'
>;
