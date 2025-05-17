// general
import ReactDOM from 'react-dom/client';
import './index.css';

// react query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Notistack
import { SnackbarProvider } from 'notistack';

// chakra
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'

// local
import Layout from './Layout';

// libs
import theme from './libs/themes/BaseTheme';

// Configure React Query client with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes
      gcTime: 1000 * 60 * 30, // Cache is kept for 30 minutes
      retry: 3, // Retry failed requests 3 times
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
      refetchOnWindowFocus: true, // Refetch when window regains focus
      refetchOnMount: true, // Refetch when component mounts
      refetchOnReconnect: true, // Refetch when network reconnects
      refetchInterval: false, // Disable automatic refetching
    },
    mutations: {
      retry: 2, // Retry failed mutations 2 times
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <ChakraProvider theme={theme}>
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider maxSnack={5} anchorOrigin={{
        vertical: "bottom", horizontal: "right"
      }}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Layout />
      </SnackbarProvider>
    </QueryClientProvider>
  </ChakraProvider>
);
