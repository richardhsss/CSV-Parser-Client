import { User } from 'src/types';
import { API_ENDPOINTS } from '../../constants';
import { api } from '../axios';

export const signIn = async ({ email, password }: User) => {
  return await api.post(API_ENDPOINTS.SIGNIN, { email, password });
};

export const signUp = async ({ email, password }: User) => {
  return await api.post(API_ENDPOINTS.SIGNUP, { email, password });
};

export const signOut = async () => {
  return await api.post(API_ENDPOINTS.SIGNOUT);
};
