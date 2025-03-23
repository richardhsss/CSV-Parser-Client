import { Link } from 'react-router';
import styles from './styles.module.css';
import { ERROR_MESSAGES, PATH } from '../../constants';
import { useCallback, useContext, useState } from 'react';
import { upload } from 'src/libs/http/file';
import { Context } from '../Root';
import Modal from '../Modal';

function Header() {
  const { isUserLogged, handleLogout, setData } = useContext(Context);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }

      setIsLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);

      try {
        const { data } = await upload(formData);
        setData(data.data);
      } catch (error: any) {
        setError(error?.response?.data?.message || ERROR_MESSAGES.SMTH_WRONG);

        if (error?.response?.status === 401) {
          handleLogout();
        }
      } finally {
        setIsLoading(false);
      }
    },
    [setData, handleLogout]
  );

  const handleClose = () => {
    setError(null);
  };

  return (
    <>
      <header className={styles.header}>
        <Link className={styles.logo} to={PATH.HOME}>
          IFILE
        </Link>

        {isUserLogged ? (
          <div className={styles.actions}>
            <label
              htmlFor="file-upload"
              className={`${styles.uploadButton} ${styles.button}`}
            >
              Upload CSV
              <input
                id="file-upload"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                disabled={isLoading}
                className={styles.fileInput}
              />
            </label>

            <button className={styles.button} onClick={handleLogout}>
              Log out
            </button>
          </div>
        ) : null}
      </header>
      {error ? <Modal handleClose={handleClose} text={error} /> : null}
    </>
  );
}

export default Header;
