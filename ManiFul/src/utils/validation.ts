import { validationType } from '../types/validation';

export const validateEmail = (email: string): validationType => {
  if (email !== null && email.length >= 3)
    return { status: true, message: 'Success' };

  return { status: false, message: 'An email must be provided' };
};
