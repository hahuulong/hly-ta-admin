import { ENV } from '@/config/env';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
    component: Index,
});

function Index() {
    return (
        <div className="p-2">
            <h3>Welcome Home Page!</h3>
            <p>{JSON.stringify(ENV.VITE_API_URL)}</p>
        </div>
    );
}
