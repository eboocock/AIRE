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
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="mb-8">
          <div className="w-24 h-24 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto">
            <i className="fas fa-exclamation-triangle text-red-400 text-4xl" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">Something went wrong</h1>
        <p className="text-gray-400 mb-8">
          We encountered an unexpected error. Our team has been notified and is working on a fix.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={reset}
            className="px-6 py-3 bg-aire-500 hover:bg-aire-600 text-white font-semibold rounded-lg transition"
          >
            <i className="fas fa-redo mr-2" />
            Try Again
          </button>
          <a
            href="/"
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition"
          >
            <i className="fas fa-home mr-2" />
            Go Home
          </a>
        </div>

        {error.digest && (
          <p className="text-gray-600 text-xs mt-8">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
