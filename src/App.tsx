import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';
import { PATH } from './constants';
import Spinner from './components/Spinner';

const NotFound = lazy(() => import('./pages/NotFound'));
const Home = lazy(() => import('./pages/Home'));
const Layout = lazy(() => import('./components/Layout'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path={PATH.HOME} element={<Layout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path={PATH.ALL} element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
