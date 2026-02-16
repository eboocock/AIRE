'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const listingId = searchParams.get('listing_id');

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="mb-8">
          <div className="w-24 h-24 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto animate-bounce">
            <i className="fas fa-check text-green-400 text-4xl" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-white mb-4">
          You're Live!
        </h1>
        <p className="text-xl text-gray-300 mb-2">
          Your listing is now active on AIREA
        </p>
        <p className="text-gray-500 mb-8">
          We're syndicating to MLS, Zillow, Redfin, and 100+ partner sites.
          Buyers will start seeing your property soon.
        </p>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">What Happens Next?</h2>
          <div className="space-y-4 text-left">
            {[
              { icon: 'fa-bullhorn', text: 'Your listing goes live on 100+ sites within 24 hours' },
              { icon: 'fa-bell', text: 'You\'ll receive notifications for inquiries and showing requests' },
              { icon: 'fa-file-alt', text: 'Offers will appear in your dashboard with AI analysis' },
            ].map((item, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-aire-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className={`fas ${item.icon} text-aire-400 text-sm`} />
                </div>
                <p className="text-gray-300 text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={listingId ? `/listings/${listingId}` : '/dashboard'}
            className="px-6 py-3 bg-aire-500 hover:bg-aire-600 text-white font-semibold rounded-lg transition"
          >
            <i className="fas fa-eye mr-2" />
            View Your Listing
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition"
          >
            <i className="fas fa-th-large mr-2" />
            Go to Dashboard
          </Link>
        </div>

        <p className="text-gray-600 text-sm mt-8">
          Questions? <Link href="/contact" className="text-aire-400 hover:text-aire-300">Contact our support team</Link>
        </p>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <i className="fas fa-spinner fa-spin text-aire-400 text-2xl" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
