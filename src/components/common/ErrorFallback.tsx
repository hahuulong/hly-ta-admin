import type { FallbackProps } from 'react-error-boundary';

export const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-linear-to-r from-red-100 via-red-200 to-red-300 p-6">
            <div className="bg-white shadow-2xl rounded-3xl p-8 max-w-md w-full text-center animate-fadeIn">
                <div className="inline-block bg-red-600 text-white rounded-full p-4 mb-6 shadow-lg">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
                <pre className="text-sm text-gray-600 bg-red-50 p-3 rounded-md overflow-x-auto whitespace-pre-wrap mb-6">
                    {error.message}
                </pre>
                <button
                    onClick={resetErrorBoundary}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                >
                    Retry
                </button>
            </div>
        </div>
    );
};
