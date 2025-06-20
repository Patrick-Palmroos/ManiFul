import { Animated, Easing } from 'react-native';

export const runMiddleButtonPressAnimation = (scaleAnim: Animated.Value) => {
  Animated.sequence([
    Animated.timing(scaleAnim, {
      toValue: 0.9,
      duration: 100,
      useNativeDriver: true,
      easing: Easing.out(Easing.quad),
    }),
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
      easing: Easing.out(Easing.quad),
    }),
  ]).start();
};
