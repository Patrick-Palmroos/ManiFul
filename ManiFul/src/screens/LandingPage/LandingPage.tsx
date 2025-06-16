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
import { validateEmail, validatePassword } from '../../utils/validation';
import { useAuth } from '../../context/AuthContext';
import { authRes } from '../../types/auth';

type inputProps = {
  email: string;
  password: string;
};

type errorProp = {
  type: 'email' | 'password';
  message: string;
};

const LandingPage = () => {
  const { login, isAuthenticated } = useAuth();
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [input, setInput] = useState<inputProps>({ email: '', password: '' });
  const [error, setError] = useState<errorProp[] | null>(null);
  const navigation = useNavigation<LandingPageNavigationProp>();
  const { width } = useWindowDimensions();

  //handles setting focused field for reactive styling.
  const handleFocusing = (field: string) => setFocusedInput(field);

  //unfocusing the fields
  const handleBlur = () => setFocusedInput(null);

  const onLogin = async (): Promise<boolean> => {
    try {
      const validations = [
        { field: 'email', result: validateEmail(input.email) },
        { field: 'password', result: validatePassword(input.password) },
      ];

      const newErrors: errorProp[] = validations
        .filter(({ result }) => !result.status)
        .map(({ field, result }) => ({
          type: field as 'email' | 'password',
          message: result.message,
        }));

      setError(newErrors);

      if (newErrors.length === 0) {
        const res: authRes = await login({
          email: input.email,
          password: input.password,
        });
        console.log(res);
        if (res.status === 200) {
          navigation.navigate('home');
        }
        return true;
      }

      return false;
    } catch (e) {
      return false;
    }
  };

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
              <Text style={generalStyles.errorCode}>
                {error?.find(e => e.type === 'email')?.message}
              </Text>
              <TextInput
                onFocus={() => handleFocusing('email')}
                onBlur={handleBlur}
                placeholder="Email"
                value={input?.email}
                onChangeText={text => setInput({ ...input, email: text })}
                style={[
                  generalStyles.textField,
                  focusedInput === 'email' && generalStyles.textFieldFocused,
                  error?.some(e => e.type === 'email') &&
                    generalStyles.textFieldError,
                ]}
              />
            </View>
            <View style={{ marginBottom: 10, width: '100%' }}>
              <Text style={generalStyles.errorCode}>
                {error?.find(e => e.type === 'password')?.message}
              </Text>
              <TextInput
                onFocus={() => handleFocusing('password')}
                onBlur={handleBlur}
                placeholder="password"
                value={input?.password}
                secureTextEntry={true}
                onChangeText={text => setInput({ ...input, password: text })}
                style={[
                  generalStyles.textField,
                  focusedInput === 'password' && generalStyles.textFieldFocused,
                  error?.some(e => e.type === 'password') &&
                    generalStyles.textFieldError,
                ]}
              />
            </View>
            <GradientButton
              text="Login"
              onClick={onLogin}
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
