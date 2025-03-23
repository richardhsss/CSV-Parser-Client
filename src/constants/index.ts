const GENERAL_PATH = {
  AUTH: '/auth',
};

export const PATH = {
  HOME: '/',
  ALL: '*',
  SIGN_IN: `${GENERAL_PATH.AUTH}/signIn`,
  SIGN_UP: `${GENERAL_PATH.AUTH}/signUp`,
};

export const API_ENDPOINTS = {
  SIGNOUT: `${GENERAL_PATH.AUTH}/signout`,
  SIGNIN: `${GENERAL_PATH.AUTH}/signin`,
  SIGNUP: `${GENERAL_PATH.AUTH}/signup`,
  UPLOAD: '/upload',
};

export const ERROR_MESSAGES = {
  REQUIRED: 'This field is required',
  EMAIL: 'The email is invalid',
  MIN: (value: number) => `This field should contain min ${value} units`,
  MAX: (value: number) => `This field should contain max ${value} units`,
  SMTH_WRONG: 'Something went wrong. Please try again',
};

export const LOCAL_STORAGE_KEYS = {
  IS_LOGGED: 'isLogged',
};

export const TABLE_ROW_HEIGHT = 65;

export const TABLE_COLUMN_WIDTH = 110;
