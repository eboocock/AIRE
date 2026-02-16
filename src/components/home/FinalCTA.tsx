'use client';

import Link from 'next/link';

export function FinalCTA() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-6xl font-black mb-6">
          Ready to Sell
          <br />
          <span className="gradient-text">Your Way?</span>
        </h2>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Get a free AI property estimate and see how AIREA can help you sell FSBO in Washington State.
        </p>
        <Link
          href="/signup"
          className="inline-block bg-aire-500 hover:bg-aire-600 text-white px-10 py-5 rounded-xl font-bold text-xl transition shadow-lg shadow-aire-500/25"
        >
          Get Started — It's Free
          <i className="fas fa-arrow-right ml-3" />
        </Link>
        <p className="text-gray-500 text-sm mt-4">
          No credit card required • Starting at $299 • Washington State
        </p>
      </div>
    </section>
  );
}
