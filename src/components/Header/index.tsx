import { Link } from 'react-router';
import styles from './styles.module.css';
import { PATH } from '../../constants';
import { useContext } from 'react';
import { AuthContext } from '../AuthProvider';

function Header() {
  const { isUserLogged, handleLogout } = useContext(AuthContext);

  return (
    <header className={styles.header}>
      <Link className={styles.logo} to={PATH.HOME}>
        IFILE
      </Link>

      {isUserLogged ? (
        <button className={styles.button} onClick={handleLogout}>
          Log out
        </button>
      ) : null}
    </header>
  );
}

export default Header;
