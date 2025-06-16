//LandingPage.tsx
import React from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  useWindowDimensions,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import styles from './styles';
import { LandingPageNavigationProp } from '../../types/navigation';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../styles/colors';
import generalStyles from '../../styles/styles';
import GradientButton from '../../components/GradientButton/GradientButton';
import { useState } from 'react';

type inputProps = {
  email: string;
  password: string;
};

const LandingPage = () => {
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [input, setInput] = useState<inputProps>({ email: '', password: '' });
  const navigation = useNavigation<LandingPageNavigationProp>();
  const { width } = useWindowDimensions();

  //handles setting focused field for reactive styling.
  const handleFocusing = (field: string) => setFocusedInput(field);

  //unfocusing the fields
  const handleBlur = () => setFocusedInput(null);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <LinearGradient
        colors={[colors.background, colors.backgroundWarm]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={styles.container}>
        <View style={{ ...styles.box }}>
          <Image
            source={require('../../assets/images/maniful-logo.png')}
            style={{
              width: '70%',
              height: '50%',
              resizeMode: 'contain',
            }}
          />
          <Text
            style={{
              fontFamily: 'Rubik-Bold',
              fontSize: 32,
              color: '#5C0037',
            }}>
            ManiFul
          </Text>
          <Text
            style={{
              fontFamily: 'Rubik-SemiBold',
              fontSize: 16,
              color: '#68485B',
              textAlign: 'center',
              width: '85%',
            }}>
            Knowing where your money goes made easy!
          </Text>
          <View style={styles.loginField}>
            <View style={{ marginBottom: 10, width: '100%' }}>
              <TextInput
                onFocus={() => handleFocusing('email')}
                onBlur={handleBlur}
                placeholder="Email"
                value={input?.email}
                onChangeText={text => setInput({ ...input, email: text })}
                style={[
                  generalStyles.textField,
                  focusedInput === 'email' && generalStyles.textFieldFocused,
                ]}
              />
            </View>
            <View style={{ marginBottom: 10, width: '100%' }}>
              <TextInput
                onFocus={() => handleFocusing('password')}
                onBlur={handleBlur}
                placeholder="password"
                value={input?.password}
                onChangeText={text => setInput({ ...input, password: text })}
                style={[
                  generalStyles.textField,
                  focusedInput === 'password' && generalStyles.textFieldFocused,
                ]}
              />
            </View>
            <GradientButton
              text="Login"
              onClick={() => console.log(input)}
              marginTop={20}
              width={'80%'}
            />
          </View>
        </View>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default LandingPage;
