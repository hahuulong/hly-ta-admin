import { auth } from '@/utils/auth';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';

export function LogoutButton() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const handleLogout = async () => {
        // gọi api logout ...
        auth.logout();
        queryClient.clear();
        await router.invalidate();
        // router.navigate({ to: '/login', replace: true });
    };

    return <button onClick={handleLogout}>Logout</button>;
}
