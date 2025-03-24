import { Link } from 'react-router';
import styles from './styles.module.css';
import { ERROR_MESSAGES, PATH } from '../../constants';
import { ChangeEvent, useCallback, useContext } from 'react';
import { upload } from 'src/libs/http/file';
import { Context } from '../Root';

function Header() {
  const {
    isUserLogged,
    handleLogout,
    setData,
    setError,
    setIsGlobalLoading,
    isGlobalLoading,
    setLoadedRows,
  } = useContext(Context);

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (!file) {
        return;
      }

      setIsGlobalLoading(true);

      const formData = new FormData();
      formData.append('file', file);

      try {
        const { data } = await upload(formData);
        setData(data.data);
        setLoadedRows(new Set());
      } catch (error: any) {
        setError(error?.response?.data?.message || ERROR_MESSAGES.SMTH_WRONG);

        if (error?.response?.status === 401) {
          handleLogout();
        }
      } finally {
        setIsGlobalLoading(false);
        event.target.value = '';
      }
    },
    [setData, setLoadedRows, handleLogout, upload, setError, setIsGlobalLoading]
  );

  return (
    <header className={styles.header}>
      <Link className={styles.logo} to={PATH.HOME}>
        IFILE
      </Link>

      {isUserLogged ? (
        <div className={styles.actions}>
          <label
            htmlFor="file"
            className={`${styles.uploadButton} ${styles.button}`}
          >
            Upload CSV
            <input
              id="file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={isGlobalLoading}
              className={styles.fileInput}
            />
          </label>

          <button className={styles.button} onClick={handleLogout}>
            Log out
          </button>
        </div>
      ) : null}
    </header>
  );
}

export default Header;
