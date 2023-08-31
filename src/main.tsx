import React from 'react';
import ReactDOM from 'react-dom/client';
import App from 'src/App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProvider } from './context/app.context';
import ErrorBoundary from './components/ErrorBoundary';
import 'src/i18n/i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false }
  }
});
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ErrorBoundary>
          <AppProvider>
            <App />
          </AppProvider>
        </ErrorBoundary>
      </BrowserRouter>
      <ReactQueryDevtools />
    </QueryClientProvider>
  </React.StrictMode>
);
