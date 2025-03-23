import { useContext } from 'react';
import { PATH } from '../../constants/';
import { Navigate, Outlet } from 'react-router';
import { Context } from '../Root';

function ProtectedRoute() {
  const { isUserLogged } = useContext(Context);

  return isUserLogged ? <Outlet /> : <Navigate to={PATH.SIGN_IN} replace />;
}

export default ProtectedRoute;
