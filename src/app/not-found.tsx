import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-gray-900 border border-gray-800 rounded-full flex items-center justify-center mx-auto">
            <i className="fas fa-home-alt text-gray-600 text-4xl" />
          </div>
        </div>

        <h1 className="text-6xl font-black text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-300 mb-4">Page Not Found</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="px-6 py-3 bg-aire-500 hover:bg-aire-600 text-white font-semibold rounded-lg transition"
          >
            <i className="fas fa-home mr-2" />
            Go Home
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition"
          >
            <i className="fas fa-envelope mr-2" />
            Contact Support
          </Link>
        </div>

        <p className="text-gray-600 text-sm mt-8">
          Looking to sell your home? <Link href="/signup" className="text-aire-400 hover:text-aire-300">Get started free</Link>
        </p>
      </div>
    </div>
  );
}
