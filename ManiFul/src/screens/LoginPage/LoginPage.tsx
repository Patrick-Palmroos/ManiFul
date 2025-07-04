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
import { LoginPageNavigationProp } from '../../types/navigation';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../../styles/colors';
import text from '../../styles/text';
import generalStyles from '../../styles/styles';
import GradientButton from '../../components/GradientButton/GradientButton';
import { useState, useEffect } from 'react';
import { validateEmail, validatePassword } from '../../utils/validation';
import { useAuth } from '../../context/AuthContext';
import { authRes } from '../../types/auth';
import * as Keychain from 'react-native-keychain';
import { UserCredentials } from 'react-native-keychain';

type inputProps = {
  email: string;
  password: string;
};

type errorProp = {
  type: 'email' | 'password' | 'other';
  message: string;
};

const Loginpage = () => {
  const { login, isAuthenticated, user } = useAuth();
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [input, setInput] = useState<inputProps>({ email: '', password: '' });
  const [error, setError] = useState<errorProp[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation<LoginPageNavigationProp>();
  const { width } = useWindowDimensions();

  const [test, setTest] = useState<UserCredentials>();

  useEffect(() => {
    const test = async () => {
      const res = await Keychain.getGenericPassword();
      if (res) setTest(res);
    };

    test();
  }, []);

  //handles setting focused field for reactive styling.
  const handleFocusing = (field: string) => setFocusedInput(field);

  //unfocusing the fields
  const handleBlur = () => setFocusedInput(null);

  const onLogin = async () => {
    try {
      setLoading(true);

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
        if (res.status !== 200) {
          if (res.status === 401) {
            setError([{ type: 'other', message: 'Incorrect credentials' }]);
          } else {
            setError([{ type: 'other', message: res.message }]);
          }
        }
      }
    } catch (e) {
      setError([{ type: 'other', message: `Local login error.` }]);
    } finally {
      setLoading(false);
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
            <Text
              style={{
                ...generalStyles.errorCode,
                textAlign: 'center',
                fontSize: 16,
              }}>
              {error?.find(e => e.type === 'other')?.message}
            </Text>
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
              loading={loading}
              marginTop={10}
              width={'80%'}
            />
            <Text
              style={{
                ...text.subtext,
                maxWidth: '70%',
                textAlign: 'center',
                marginTop: 10,
              }}>
              Dont't have an account yet?{' '}
              <Text
                style={{
                  ...text.subtext,
                  color: '#0047A3',
                  cursor: 'pointer',
                }}>
                Register here.
              </Text>
            </Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

export default Loginpage;
