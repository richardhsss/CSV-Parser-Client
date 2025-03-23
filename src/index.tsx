import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router';
import ErrorBoundary from './pages/ErrorBoundary';
import './styles/global.css';
import Root from './components/Root';

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
