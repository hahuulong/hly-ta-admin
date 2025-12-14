import { Link } from '@tanstack/react-router';

export default function NotFound() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-linear-to-r from-purple-500 via-pink-500 to-red-500 p-6">
            <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md text-center">
                <h1 className="text-6xl font-extrabold text-gray-800 mb-4 animate-pulse">404</h1>
                <h2 className="text-2xl font-semibold text-gray-700 mb-6">Oops! Page Not Found</h2>
                <p className="text-gray-500 mb-8">The page you’re looking for doesn’t exist or has been moved.</p>
                <Link
                    to="/"
                    className="inline-block bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                >
                    Go Home
                </Link>
            </div>
        </div>
    );
}
