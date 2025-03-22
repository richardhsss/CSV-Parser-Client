import { useCallback, useContext, useMemo, useState } from 'react';
import styles from './styles.module.css';
import { Link, useLocation } from 'react-router';
import { ERROR_MESSAGES, PATH } from '../../constants';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Input from '../Input';
import { validation, defaultValues } from './form';
import { AuthContext } from '../AuthProvider';
import { signIn, signUp } from '../../libs/http/auth';
import Spinner from '../Spinner';
import { User } from 'src/types';
import Modal from '../Modal';

function Auth() {
  const { handleLogin } = useContext(AuthContext);
  const { pathname } = useLocation();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isValid, isSubmitted },
  } = useForm<User>({
    resolver: yupResolver(validation),
    defaultValues,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const isSignUp = useMemo(() => pathname === PATH.SIGN_UP, [pathname]);

  const isButtonDisabled = useMemo(
    () => (isLoading || !isValid) && isSubmitted,
    [isValid, isLoading, isSubmitted]
  );

  const handleAuthSubmit = useCallback(
    async (data: User) => {
      setIsLoading(true);

      try {
        if (isSignUp) {
          await signUp(data);
        } else {
          await signIn(data);
        }

        handleLogin();
        reset();
      } catch (error: any) {
        setError(error?.response?.data?.message || ERROR_MESSAGES.SMTH_WRONG);
      } finally {
        setIsLoading(false);
      }
    },
    [isSignUp, signUp, signIn, reset, handleLogin, setIsLoading]
  );

  const handleClose = () => {
    setError(null);
  };

  return (
    <>
      <section className={styles.section}>
        <h1>{isSignUp ? 'Sign Up' : 'Sign In'}</h1>

        <form
          autoComplete="off"
          className={styles.form}
          onSubmit={handleSubmit(handleAuthSubmit)}
        >
          <Input
            type="text"
            name="email"
            placeholder="Email"
            register={register}
            error={errors?.email?.message}
            disabled={isLoading}
          />

          <Input
            type="password"
            name="password"
            placeholder="Password"
            register={register}
            disabled={isLoading}
            error={errors?.password?.message}
          />

          <button
            className={styles.button}
            type="submit"
            disabled={isButtonDisabled}
          >
            {isLoading ? <Spinner /> : isSignUp ? 'Register' : 'Login'}
          </button>
        </form>

        <div className={styles.linkWrapper}>
          <p>{isSignUp ? 'Have an account? ' : 'New user? '}</p>

          <Link
            className={styles.link}
            to={isSignUp ? PATH.SIGN_IN : PATH.SIGN_UP}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </Link>
        </div>
      </section>
      {error ? <Modal handleClose={handleClose} text={error} /> : null}
    </>
  );
}

export default Auth;
