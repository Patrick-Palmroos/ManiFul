//LandingPage.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';
import styles from './styles';
import { LandingPageNavigationProp } from '../../types/navigation';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../../styles/Colors';

const LandingPage = () => {
  const navigation = useNavigation<LandingPageNavigationProp>();

  return (
    <LinearGradient
      colors={[Colors.background, Colors.backgroundWarm]}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}>
      <Text>Landing Page</Text>
      <Button
        title="go to login"
        onPress={() => navigation.navigate('login')}
      />
    </LinearGradient>
  );
};

export default LandingPage;
