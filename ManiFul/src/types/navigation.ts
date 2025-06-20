//types/navigation.ts
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  login: undefined;
  signup: undefined;
  home: undefined;
  profile: undefined;
  // Add other screens here
};

export type AuthStackParamList = {
  login: undefined;
  signup: undefined;
  // Add other screens here
};

export type MainStackParamList = {
  TabNav: undefined;
  profile: undefined;
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
