'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Application error:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="text-red-500 mb-4">
                    <svg
                        className="w-16 h-16 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Something went wrong!
                </h2>
                <p className="text-gray-600 mb-6">
                    An unexpected error occurred. Please try again.
                </p>
                {process.env.NODE_ENV === 'development' && (
                    <div className="bg-gray-100 rounded p-4 mb-6 text-left">
                        <p className="text-sm font-mono text-red-600 break-all">
                            {error.message}
                        </p>
                        {error.digest && (
                            <p className="text-xs text-gray-500 mt-2">
                                Error ID: {error.digest}
                            </p>
                        )}
                    </div>
                )}
                <button
                    onClick={reset}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
                >
                    Try again
                </button>
            </div>
        </div>
    );
}