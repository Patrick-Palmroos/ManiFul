import { validationType } from '../types/validation';

// basic RFC 5322 compliant check
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// atleast 8 chars, one uppercase, one lowercase, one number, one special char
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const validateEmail = (email: string): validationType => {
  if (!email) {
    return { status: false, message: 'An email must be provided' };
  }

  if (!emailRegex.test(email)) {
    return { status: false, message: 'Invalid email format' };
  }

  return { status: true, message: 'Success' };
};

export const validatePassword = (password: string): validationType => {
  if (!password) {
    return { status: false, message: 'A password must be provided' };
  }

  if (!passwordRegex.test(password)) {
    return {
      status: false,
      message:
        'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character',
    };
  }

  return { status: true, message: 'Success' };
};
