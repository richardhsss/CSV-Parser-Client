import { ERROR_MESSAGES } from 'src/constants';
import { User } from 'src/types';
import { object, string } from 'yup';

export const defaultValues: User = {
  email: '',
  password: '',
};

const MIN_PASSWORD_UNIT = 8;
const MAX_PASSWORD_UNIT = 40;

export const validation = object().shape({
  email: string().email(ERROR_MESSAGES.EMAIL).required(ERROR_MESSAGES.REQUIRED),
  password: string()
    .required(ERROR_MESSAGES.REQUIRED)
    .min(MIN_PASSWORD_UNIT, ERROR_MESSAGES.MIN(MIN_PASSWORD_UNIT))
    .max(MAX_PASSWORD_UNIT, ERROR_MESSAGES.MAX(MAX_PASSWORD_UNIT)),
});
