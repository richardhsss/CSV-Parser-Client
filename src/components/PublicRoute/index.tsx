import { Navigate, Outlet } from 'react-router';
import { PATH } from '../../constants';
import { useContext } from 'react';
import { AuthContext } from '../../components/AuthProvider';

function PublicRoute() {
  const { isUserLogged } = useContext(AuthContext);

  return isUserLogged ? <Navigate to={PATH.HOME} replace /> : <Outlet />;
}

export default PublicRoute;
