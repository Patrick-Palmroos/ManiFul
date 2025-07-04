import { validationType } from '../types/validation';

export const validateEmail = (email: string): validationType => {
  if (email !== null && email.length >= 3)
    return { status: true, message: 'Success' };

  return { status: false, message: 'An email must be provided' };
};

export const validatePassword = (password: string): validationType => {
  if (password !== null && password.length >= 3)
    return { status: true, message: 'Success' };

  return { status: false, message: 'A password must be provided' };
};
