import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, Text, Dimensions } from 'react-native';
import styles from './styles';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../styles/colors';
import ActionModal from '../../screens/ActionModal';
import { useModalContext } from '../../context/ModalContext';
import { useRef } from 'react';
import { Animated } from 'react-native';
import {
  runMiddleButtonPressAnimation,
  useTabIconAnimations,
} from './animations';
import Svg, { Path } from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');

const TabBarBackground = ({ height = 80, notchRadius = 45 }) => {
  const center = screenWidth / 2;

  const d = `
    M0 0
    H${center - notchRadius}
    A ${notchRadius / 2} ${notchRadius / 2} 0 0 0 ${center + notchRadius} 0
    H${screenWidth}
    V${height}
    H0
    Z
  `;

  return (
    <Svg
      width={screenWidth}
      height={height}
      style={{ position: 'absolute', bottom: 0, right: 0, left: 0 }}>
      <Path d={d} fill={colors.highlight} />
    </Svg>
  );
};

const CustomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const { openModal } = useModalContext();
  const { animations, animateTab } = useTabIconAnimations(state.routes.length);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleMiddlePress = () => {
    runMiddleButtonPressAnimation(scaleAnim);
    openModal({ content: <ActionModal />, id: 'ActionModal' });
  };

  return (
    <View style={styles.container}>
      <TabBarBackground />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const label =
          typeof options.tabBarLabel === 'string'
            ? options.tabBarLabel
            : typeof options.title === 'string'
            ? options.title
            : route.name;
        animateTab(index, isFocused);

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        //middle button
        const isMiddle = index === Math.floor(state.routes.length / 2);

        return (
          <TouchableOpacity
            key={route.key}
            activeOpacity={100}
            onPress={isMiddle ? handleMiddlePress : onPress}
            style={[styles.tab, isMiddle && styles.middleTab]}>
            <View>
              {isMiddle ? (
                <View style={styles.middleView}>
                  <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                    <View style={styles.middleButton}>
                      <LinearGradient
                        colors={[colors.highlight, colors.gradient]}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 0 }}
                        style={{ borderRadius: 45 }}>
                        <MaterialIcons
                          name={'add'}
                          size={70}
                          color={isFocused ? '#A8FFFE' : 'white'}
                        />
                      </LinearGradient>
                    </View>
                  </Animated.View>
                </View>
              ) : (
                <Animated.View
                  style={{ transform: [{ scale: animations[index] }] }}>
                  <MaterialIcons
                    name={
                      route.name === 'home'
                        ? 'home'
                        : route.name === 'history'
                        ? 'history'
                        : route.name === 'budgets'
                        ? 'calendar-today'
                        : 'bar-chart'
                    }
                    size={isFocused ? 35 : 30}
                    color={isFocused ? '#A8FFFE' : 'white'}
                  />
                </Animated.View>
              )}
            </View>
            {!isMiddle && (
              <Text style={isFocused ? styles.labelActive : styles.label}>
                {label}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CustomTabBar;
