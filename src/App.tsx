import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';
import { PATH } from './constants';
import Spinner from './components/Spinner';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

const Layout = lazy(() => import('./components/Layout'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Home = lazy(() => import('./pages/Home'));
const SignIn = lazy(() => import('./pages/SignIn'));
const SignUp = lazy(() => import('./pages/SignUp'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path={PATH.HOME} element={<Layout />}>
          <Route element={<PublicRoute />}>
            <Route path={PATH.SIGN_IN} element={<SignIn />} />
            <Route path={PATH.SIGN_UP} element={<SignUp />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route index element={<Home />} />
          </Route>
          <Route path={PATH.ALL} element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
