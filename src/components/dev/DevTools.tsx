import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

export const DevTools = () => {
    // if (!import.meta.env.DEV) return null; // chỉ bật khi dev, thực tế thư viện tự tắt khi lên prod
    return (
        <>
            <TanStackRouterDevtools />
            <ReactQueryDevtools initialIsOpen={false} />
        </>
    );
};
