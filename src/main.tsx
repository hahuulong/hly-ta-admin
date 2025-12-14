import * as api from '@/api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'sonner';
import './index.css';
import { routeTree } from './routeTree.gen';
import { auth } from './utils/auth';

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60_000,
            gcTime: 60_000 * 5,
            retry: 1,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
        },
    },
});

// Create a new router instance
const router = createRouter({
    routeTree,
    context: {
        queryClient,
        api,
        auth: {
            getUser: () => null, // sẽ inject lại ở React
        },
    },
});
// Register the router instance for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <StrictMode>
            <QueryClientProvider client={queryClient}>
                <RouterProvider
                    router={router}
                    context={{
                        queryClient,
                        api,
                        auth: {
                            getUser: auth.getUser,
                        },
                    }}
                />
                <Toaster />
            </QueryClientProvider>
        </StrictMode>,
    );
}
