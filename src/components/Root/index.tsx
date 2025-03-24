import {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { LOCAL_STORAGE_KEYS } from 'src/constants';
import { signOut } from 'src/libs/http/auth';
import {
  getItemStorage,
  removeItemStorage,
  setItemStorage,
} from 'src/utils/localStorage';
import Spinner from '../Spinner';
import Modal from '../Modal';

type ContextType = {
  handleLogout: () => void;
  handleLogin: () => void;
  isUserLogged: boolean;
  data: string[][];
  handleChangeData: (data: string[][]) => void;
  setData: (data: string[][]) => void;
  setError: (error: null | string) => void;
  setIsGlobalLoading: (value: boolean) => void;
  isGlobalLoading: boolean;
  handleChangeLoadedRows: ({
    startIndex,
    nextIndex,
  }: {
    startIndex: number;
    nextIndex: number;
  }) => void;
  isRowLoaded: ({ index }: { index: number }) => boolean;
  setLoadedRows: (value: Set<number>) => void;
};

export const Context = createContext<ContextType>({
  handleLogout: () => {},
  handleLogin: () => {},
  handleChangeData: () => {},
  setData: () => {},
  setIsGlobalLoading: () => {},
  isUserLogged: false,
  data: [],
  setError: () => {},
  isGlobalLoading: false,
  isRowLoaded: () => false,
  handleChangeLoadedRows: () => {},
  setLoadedRows: () => {},
});

function Root({ children }: PropsWithChildren) {
  const [isUserLogged, setIsUserLogged] = useState(false);
  const [data, setData] = useState<string[][]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const [loadedRows, setLoadedRows] = useState(new Set<number>());

  const handleChangeData = (newData: string[][]) => {
    setData((prev: string[][]) => [...prev, ...newData]);
  };

  const isRowLoaded = useCallback(
    ({ index }: { index: number }) => loadedRows.has(index),
    [loadedRows]
  );

  const handleChangeLoadedRows = ({
    startIndex,
    nextIndex,
  }: {
    startIndex: number;
    nextIndex: number;
  }) => {
    setLoadedRows((prev) => {
      const newSet = new Set(prev);

      for (let i = startIndex; i < nextIndex; i++) {
        newSet.add(i);
      }

      return newSet;
    });
  };

  const handleLogout = useCallback(async () => {
    setIsGlobalLoading(true);

    try {
      await signOut();
    } finally {
      removeItemStorage(LOCAL_STORAGE_KEYS.IS_LOGGED);
      setIsUserLogged(false);
      setIsGlobalLoading(false);
      setData([]);
    }
  }, [
    setIsGlobalLoading,
    signOut,
    removeItemStorage,
    setIsUserLogged,
    setData,
  ]);

  const handleClose = () => {
    setError(null);
  };

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
          isGlobalLoading,
          setIsGlobalLoading,
          setError,
          data,
          handleChangeData,
          handleLogout,
          handleLogin,
          isUserLogged,
          setData,
          isRowLoaded,
          handleChangeLoadedRows,
          setLoadedRows,
        }}
      >
        {children}
      </Context.Provider>
      {isGlobalLoading ? <>{createPortal(<Spinner />, document.body)}</> : null}
      {error ? <Modal handleClose={handleClose} text={error} /> : null}
    </>
  );
}

export default Root;
