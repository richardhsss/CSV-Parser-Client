import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router';
import ErrorBoundary from './pages/ErrorBoundary';
import Root from './components/Root';
import './styles/global.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <ErrorBoundary>
    <BrowserRouter>
      <Root>
        <App />
      </Root>
    </BrowserRouter>
  </ErrorBoundary>
);
