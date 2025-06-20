import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, Text, Platform } from 'react-native';
import styles from './styles';
import MaterialIcons from '@react-native-vector-icons/material-icons';

const CustomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const label =
          typeof options.tabBarLabel === 'string'
            ? options.tabBarLabel
            : typeof options.title === 'string'
            ? options.title
            : route.name;

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
            onPress={onPress}
            style={[styles.tab, isMiddle && styles.middleTab]}>
            <View style={isMiddle ? styles.middleButton : undefined}>
              <MaterialIcons
                name={
                  route.name === 'home'
                    ? 'home'
                    : route.name === 'history'
                    ? 'history'
                    : route.name === 'budgets'
                    ? 'calendar-today'
                    : route.name === 'action'
                    ? 'add'
                    : 'bar-chart'
                }
                size={isMiddle ? 40 : 24}
                color={isFocused ? '#000' : '#999'}
              />
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
