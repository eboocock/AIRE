'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function CancelContent() {
  const searchParams = useSearchParams();
  const listingId = searchParams.get('listing_id');

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="mb-8">
          <div className="w-24 h-24 bg-yellow-500/20 border border-yellow-500/30 rounded-full flex items-center justify-center mx-auto">
            <i className="fas fa-pause text-yellow-400 text-4xl" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">
          Payment Cancelled
        </h1>
        <p className="text-gray-400 mb-8">
          No worries! Your listing has been saved as a draft. You can complete
          payment anytime to publish your listing.
        </p>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-3">Your listing is saved</h2>
          <p className="text-gray-400 text-sm">
            All your property details, photos, and AI analysis are preserved.
            Return to your dashboard to complete the listing whenever you're ready.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {listingId && (
            <Link
              href={`/listings/${listingId}`}
              className="px-6 py-3 bg-aire-500 hover:bg-aire-600 text-white font-semibold rounded-lg transition"
            >
              <i className="fas fa-edit mr-2" />
              Return to Listing
            </Link>
          )}
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition"
          >
            <i className="fas fa-th-large mr-2" />
            Go to Dashboard
          </Link>
        </div>

        <p className="text-gray-600 text-sm mt-8">
          Have questions about pricing?{' '}
          <Link href="/pricing" className="text-aire-400 hover:text-aire-300">
            View our pricing page
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function CheckoutCancelPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <i className="fas fa-spinner fa-spin text-aire-400 text-2xl" />
      </div>
    }>
      <CancelContent />
    </Suspense>
  );
}
