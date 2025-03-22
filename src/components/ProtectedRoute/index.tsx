import { useContext } from 'react';
import { PATH } from '../../constants/';
import { Navigate, Outlet } from 'react-router';
import { AuthContext } from '../../components/AuthProvider';

function ProtectedRoute() {
  const { isUserLogged } = useContext(AuthContext);

  return isUserLogged ? <Outlet /> : <Navigate to={PATH.SIGN_IN} replace />;
}

export default ProtectedRoute;
