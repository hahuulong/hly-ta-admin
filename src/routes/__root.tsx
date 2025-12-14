import * as api from '@/api';
import { ErrorFallback } from '@/components/common/ErrorFallback';
import { DevTools } from '@/components/dev/DevTools';
import NotFound from '@/components/pages/not-found';
import type { User } from '@/utils/auth';
import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Link, Outlet } from '@tanstack/react-router';
import { ErrorBoundary } from 'react-error-boundary';

const RootLayout = () => {
    return (
        <>
            <div className="p-2 flex gap-2">
                <Link to="/" className="[&.active]:font-bold">
                    Trang admin
                </Link>{' '}
                <Link to="/about" className="[&.active]:font-bold">
                    Trang học sinh
                </Link>
            </div>
            <hr />

            <ErrorBoundary FallbackComponent={ErrorFallback} onError={() => {}}>
                <Outlet />
            </ErrorBoundary>

            <DevTools />
        </>
    );
};

export interface RouterContext {
    queryClient: QueryClient;
    api: typeof api;
    auth: {
        getUser: () => User | null;
    };
}
export const Route = createRootRouteWithContext<RouterContext>()({
    component: RootLayout,
    notFoundComponent: NotFound,
});
