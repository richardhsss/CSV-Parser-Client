import {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { ERROR_MESSAGES, LOCAL_STORAGE_KEYS } from 'src/constants';
import { signOut } from 'src/libs/http/auth';
import {
  getItemStorage,
  removeItemStorage,
  setItemStorage,
} from 'src/utils/localStorage';
import Spinner from '../Spinner';

type AuthContextType = {
  handleLogout: () => void;
  handleLogin: () => void;
  isUserLogged: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  handleLogout: () => {},
  handleLogin: () => {},
  isUserLogged: false,
});

function AuthProvider({ children }: PropsWithChildren) {
  const [isUserLogged, setIsUserLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = useCallback(async () => {
    setIsLoading(true);

    try {
      await signOut();
      removeItemStorage(LOCAL_STORAGE_KEYS.IS_LOGGED);
      setIsUserLogged(false);
    } catch (error: any) {
      alert(error?.response?.data?.message || ERROR_MESSAGES.SMTH_WRONG);
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, signOut, setIsUserLogged]);

  const handleLogin = () => {
    setItemStorage({ key: LOCAL_STORAGE_KEYS.IS_LOGGED, value: 'true' });
    setIsUserLogged(true);
  };

  useEffect(() => {
    const isLogged = getItemStorage(LOCAL_STORAGE_KEYS.IS_LOGGED);

    setIsUserLogged(Boolean(isLogged));
  }, [setIsUserLogged]);

  return (
    <>
      <AuthContext.Provider value={{ handleLogout, handleLogin, isUserLogged }}>
        {children}
      </AuthContext.Provider>
      {isLoading ? <>{createPortal(<Spinner />, document.body)}</> : null}
    </>
  );
}

export default AuthProvider;
