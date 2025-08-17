import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Router from './Router.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App } from 'antd';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App>
        <Router />
      </App>
    </QueryClientProvider>
  </StrictMode>,
);
