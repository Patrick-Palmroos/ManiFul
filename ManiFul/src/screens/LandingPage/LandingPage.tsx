//LandingPage.tsx
import React from 'react';
import { View, Text, Button, Image, useWindowDimensions } from 'react-native';
import styles from './styles';
import { LandingPageNavigationProp } from '../../types/navigation';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../styles/colors';
import text from '../../styles/text';

const LandingPage = () => {
  const navigation = useNavigation<LandingPageNavigationProp>();
  const { width } = useWindowDimensions();

  return (
    <LinearGradient
      colors={[colors.background, colors.backgroundWarm]}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}>
      <View style={styles.box}>
        <Image
          source={require('../../assets/images/maniful-logo.png')}
          style={{
            width: '80%',
            height: '80%',
            resizeMode: 'contain',
          }}
        />
        <Text style={text.regular}>Landing Page</Text>
        <Button
          title="go to login"
          onPress={() => navigation.navigate('login')}
        />
      </View>
    </LinearGradient>
  );
};

export default LandingPage;
