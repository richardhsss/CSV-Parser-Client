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

type ContextType = {
  handleLogout: () => void;
  handleLogin: () => void;
  isUserLogged: boolean;
  data: string[][];
  handleChangeData: (data: string[][]) => void;
  setData: (data: string[][]) => void;
};

export const Context = createContext<ContextType>({
  handleLogout: () => {},
  handleLogin: () => {},
  handleChangeData: () => {},
  setData: () => {},
  isUserLogged: false,
  data: [],
});

function Root({ children }: PropsWithChildren) {
  const [isUserLogged, setIsUserLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<string[][]>([]);

  const handleChangeData = (newData: string[][]) => {
    setData((prev: string[][]) => [...prev, ...newData]);
  };

  const handleLogout = useCallback(async () => {
    setIsLoading(true);

    try {
      await signOut();
    } finally {
      removeItemStorage(LOCAL_STORAGE_KEYS.IS_LOGGED);
      setIsUserLogged(false);
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
      <Context.Provider
        value={{
          data,
          handleChangeData,
          handleLogout,
          handleLogin,
          isUserLogged,
          setData,
        }}
      >
        {children}
      </Context.Provider>
      {isLoading ? <>{createPortal(<Spinner />, document.body)}</> : null}
    </>
  );
}

export default Root;
