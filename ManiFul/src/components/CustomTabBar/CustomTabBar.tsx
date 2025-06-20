import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, Text, Platform } from 'react-native';
import styles from './styles';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../styles/colors';
import ActionModal from '../../screens/ActionModal';
import { useModalContext } from '../../context/ModalContext';

const CustomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const { openModal } = useModalContext();

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
          if (isMiddle) {
            openModal(<ActionModal />);
          } else {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          }
        };

        //middle button
        const isMiddle = index === Math.floor(state.routes.length / 2);

        return (
          <TouchableOpacity
            key={route.key}
            activeOpacity={100}
            onPress={onPress}
            style={[styles.tab, isMiddle && styles.middleTab]}>
            <View>
              {isMiddle ? (
                <View style={styles.middleView}>
                  <View style={styles.middleButtonBgWrapper}>
                    <View style={styles.middleButtonBg} />
                  </View>
                  <LinearGradient
                    colors={[colors.highlight, colors.gradient]}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.middleButton}>
                    <MaterialIcons
                      name={'add'}
                      size={70}
                      color={isFocused ? '#A8FFFE' : 'white'}
                    />
                  </LinearGradient>
                </View>
              ) : (
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
