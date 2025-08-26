import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import colors from '../../styles/colors';
import generalStyles from '../../styles/styles';
import { useState, useRef } from 'react';
import { validateEmail, validatePassword } from '../../utils/validation';
import { useAuth } from '../../context/AuthContext';
import { useModalContext } from '../../context/ModalContext';
import EULAModal from './EULAModal';
import text from '../../styles/text';

type inputProps = {
  username: string;
  email: string;
  password: string;
  repeatPassword: string;
};

type errorProp = {
  type: 'username' | 'email' | 'password' | 'repeatPassword' | 'other';
  message: string;
};

const Signup = () => {
  const [input, setInput] = useState<inputProps>({
    username: '',
    email: '',
    password: '',
    repeatPassword: '',
  });
  const [error, setError] = useState<errorProp[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const { signup } = useAuth();
  const { openModal, closeModal } = useModalContext();
  const [hasAgreed, setHasAgreed] = useState<boolean>(false);

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const repeatPasswordRef = useRef<TextInput>(null);

  const handleFocus = (field: string) => setFocusedInput(field);
  const handleBlur = () => setFocusedInput(null);

  const onSignup = async () => {
    Keyboard.dismiss();
    setLoading(true);

    // validation
    const validations: errorProp[] = [];

    if (!input.username.trim()) {
      validations.push({ type: 'username', message: 'Username is required' });
    }
    if (!validateEmail(input.email).status) {
      validations.push({ type: 'email', message: 'Invalid email format' });
    }
    if (!validatePassword(input.password).status) {
      validations.push({ type: 'password', message: 'Password too weak' });
    }
    if (input.password !== input.repeatPassword) {
      validations.push({
        type: 'repeatPassword',
        message: 'Passwords do not match',
      });
    }

    setError(validations);
    if (validations.length > 0) {
      setLoading(false);
      return;
    }

    if (hasAgreed) {
      signUserUp();
    } else {
      setLoading(false);
      openModal({
        content: (
          <EULAModal
            onConfirm={() => {
              setHasAgreed(true);
              closeModal('EULA');
              setLoading(true);
              signUserUp();
            }}
            onCancel={() => {
              closeModal('EULA');
            }}
          />
        ),
        title: 'EULA',
        id: 'EULA',
      });
    }
  };

  const signUserUp = async () => {
    try {
      // sign the user up
      const res = await signup({
        username: input.username,
        email: input.email,
        password: input.password,
      });

      if (res.status !== 200) {
        setError([{ type: 'other', message: res.message || 'Signup failed' }]);
      }
    } catch (e) {
      setError([{ type: 'other', message: 'Network error' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        backgroundColor: colors.backgroundWarm,
        height: '100%',
        paddingTop: 100,
        paddingHorizontal: 20,
        alignItems: 'center',
      }}>
      <Text
        style={{
          ...text.title,
          fontSize: 24,
          marginBottom: 20,
        }}>
        Signup
      </Text>
      <View style={{ width: '80%' }}>
        {/* username */}
        <Text style={text.regular}>Username</Text>
        <TextInput
          onFocus={() => handleFocus('username')}
          onBlur={handleBlur}
          autoCapitalize="none"
          placeholder="Username"
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current?.focus()}
          placeholderTextColor={colors.subText}
          value={input.username}
          onChangeText={text => setInput({ ...input, username: text })}
          style={[
            generalStyles.textField,
            focusedInput === 'username' && generalStyles.textFieldFocused,
            error?.some(e => e.type === 'username') &&
              generalStyles.textFieldError,
          ]}
        />
        <Text style={generalStyles.errorCode}>
          {error?.find(e => e.type === 'username')?.message}
        </Text>

        {/* email */}
        <Text style={text.regular}>Email</Text>
        <TextInput
          ref={emailRef}
          onFocus={() => handleFocus('email')}
          onBlur={handleBlur}
          autoCapitalize="none"
          placeholder="Email"
          placeholderTextColor={colors.subText}
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
          value={input.email}
          onChangeText={text => setInput({ ...input, email: text })}
          style={[
            generalStyles.textField,
            focusedInput === 'email' && generalStyles.textFieldFocused,
            error?.some(e => e.type === 'email') &&
              generalStyles.textFieldError,
          ]}
        />
        <Text style={generalStyles.errorCode}>
          {error?.find(e => e.type === 'email')?.message}
        </Text>

        {/* password */}
        <Text style={text.regular}>Password</Text>
        <TextInput
          ref={passwordRef}
          onFocus={() => handleFocus('password')}
          onBlur={handleBlur}
          autoCapitalize="none"
          secureTextEntry
          placeholder="Password"
          placeholderTextColor={colors.subText}
          returnKeyType="next"
          onSubmitEditing={() => repeatPasswordRef.current?.focus()}
          value={input.password}
          onChangeText={text => setInput({ ...input, password: text })}
          style={[
            generalStyles.textField,
            focusedInput === 'password' && generalStyles.textFieldFocused,
            error?.some(e => e.type === 'password') &&
              generalStyles.textFieldError,
          ]}
        />
        <Text style={generalStyles.errorCode}>
          {error?.find(e => e.type === 'password')?.message}
        </Text>

        {/* repeat Password */}
        <TextInput
          ref={repeatPasswordRef}
          onFocus={() => handleFocus('repeatPassword')}
          onBlur={handleBlur}
          autoCapitalize="none"
          secureTextEntry
          placeholder="Repeat password"
          placeholderTextColor={colors.subText}
          returnKeyType="done"
          onSubmitEditing={onSignup}
          value={input.repeatPassword}
          onChangeText={text => setInput({ ...input, repeatPassword: text })}
          style={[
            generalStyles.textField,
            focusedInput === 'repeatPassword' && generalStyles.textFieldFocused,
            error?.some(e => e.type === 'repeatPassword') &&
              generalStyles.textFieldError,
          ]}
        />
        <Text style={generalStyles.errorCode}>
          {error?.find(e => e.type === 'repeatPassword')?.message}
        </Text>
      </View>

      {/* submit button */}
      <TouchableOpacity
        onPress={onSignup}
        disabled={loading}
        style={{
          marginTop: 20,
          opacity: loading ? 0.5 : 1,
          backgroundColor: 'pink',
        }}>
        <Text style={{ color: 'black', fontSize: 16 }}>
          {loading ? 'Signing up...' : 'Signup'}
        </Text>
      </TouchableOpacity>

      <Text
        style={{
          ...generalStyles.errorCode,
          textAlign: 'center',
          marginTop: 10,
        }}>
        {error?.find(e => e.type === 'other')?.message}
      </Text>
    </View>
  );
};

export default Signup;
