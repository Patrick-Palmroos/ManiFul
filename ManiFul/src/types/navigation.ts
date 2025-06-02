//types/navigation.ts
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  landingPage: undefined;
  login: undefined;
  // Add other screens here
};

// Navigation prop type for LandingPage
export type LandingPageNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'landingPage'
>;