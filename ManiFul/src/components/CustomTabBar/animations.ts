import { Animated, Easing } from 'react-native';
import { useRef } from 'react';

export const runMiddleButtonPressAnimation = (scaleAnim: Animated.Value) => {
  Animated.sequence([
    Animated.timing(scaleAnim, {
      toValue: 0.93,
      duration: 100,
      useNativeDriver: true,
      easing: Easing.out(Easing.quad),
    }),
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
      easing: Easing.out(Easing.quad),
    }),
  ]).start();
};

export const useTabIconAnimations = (tabsLength: number) => {
  const animations = useRef(
    Array.from({ length: tabsLength }, () => new Animated.Value(1)),
  ).current;

  const animateTab = (index: number, isFocused: boolean) => {
    Animated.timing(animations[index], {
      toValue: isFocused ? 1.1 : 1,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  return { animations, animateTab };
};
