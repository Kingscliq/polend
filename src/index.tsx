import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { AppProvider } from './providers/AppProvider';
import { Web3ReactProvider } from '@web3-react/core';

import { getLibrary } from './components/widget/connect-wallet/web3React';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@material-tailwind/react';

// Create a client
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <Web3ReactProvider getLibrary={getLibrary}>
          <ThemeProvider>
            <BrowserRouter>
              <App />
              <ToastContainer />
            </BrowserRouter>
          </ThemeProvider>
        </Web3ReactProvider>
      </AppProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
