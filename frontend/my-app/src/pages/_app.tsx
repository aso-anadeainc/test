'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppProps } from 'next/app';
import AppTheme from '@/theme/AppTheme';
import { useState } from 'react';
import { UserProvider } from '@/context/UserContext';
import { SnackbarProvider } from '@/context/SnackbarContext';

const App = ({ Component, pageProps }: AppProps) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <AppTheme>   
          <SnackbarProvider>
            <Component {...pageProps} />
          </SnackbarProvider>
        </AppTheme>
      </UserProvider>
    </QueryClientProvider>
  );
};

export default App;
