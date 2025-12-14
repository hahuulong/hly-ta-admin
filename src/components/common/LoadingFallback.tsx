export const LoadingFallback = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
            <div className="relative flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-blue-300 rounded-full animate-spin"></div>
                <div className="absolute w-16 h-16 border-4 border-t-blue-500 border-b-blue-500 rounded-full animate-spin-slow"></div>
            </div>
            <p className="mt-6 text-gray-800 text-xl font-semibold animate-pulse">Đang tải, xin chờ một chút...</p>
        </div>
    );
};
