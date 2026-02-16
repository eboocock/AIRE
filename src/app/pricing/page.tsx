import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Pricing | AIREA',
  description: 'AIREA pricing - Sell your home for a flat $499 fee. Save thousands vs. traditional agent commissions.',
};

export default function PricingPage() {
  const included = [
    { icon: 'fa-brain', title: 'AI Property Valuation', desc: 'Real-time market analysis and pricing recommendations' },
    { icon: 'fa-pen', title: 'AI Listing Writer', desc: 'Professional listing descriptions generated instantly' },
    { icon: 'fa-bullhorn', title: 'MLS Distribution', desc: 'Listed on MLS, Zillow, Redfin, and 100+ sites' },
    { icon: 'fa-camera', title: 'Photo Guidance', desc: 'AI tips for capturing the best property photos' },
    { icon: 'fa-calendar-check', title: 'Showing Scheduler', desc: 'Automated coordination with interested buyers' },
    { icon: 'fa-file-alt', title: 'Offer Management', desc: 'AI-scored offers with negotiation insights' },
    { icon: 'fa-file-signature', title: 'Digital Documents', desc: 'All contracts and disclosures with e-signing' },
    { icon: 'fa-headset', title: 'Support', desc: 'AI + human support when you need it' },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-950 pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Sell your home for a flat fee. Keep your equity.
            </p>
          </div>

          {/* Pricing Card */}
          <div className="max-w-lg mx-auto mb-16">
            <div className="bg-gradient-to-br from-aire-600 to-aire-800 rounded-3xl p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-yellow-400 text-black px-4 py-1 text-sm font-bold rounded-bl-xl">
                Most Popular
              </div>

              <div className="mb-6">
                <span className="text-aire-200 text-lg">Flat Fee Listing</span>
                <div className="text-6xl font-black text-white mt-2">
                  $499
                </div>
                <span className="text-aire-200">one-time payment</span>
              </div>

              <div className="bg-white/10 rounded-xl p-4 mb-6">
                <div className="text-white text-lg font-semibold">
                  Save vs. 6% Commission
                </div>
                <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                  <div>
                    <div className="text-aire-200">$500K home</div>
                    <div className="text-white font-bold">Save $29,501</div>
                  </div>
                  <div>
                    <div className="text-aire-200">$750K home</div>
                    <div className="text-white font-bold">Save $44,501</div>
                  </div>
                  <div>
                    <div className="text-aire-200">$1M home</div>
                    <div className="text-white font-bold">Save $59,501</div>
                  </div>
                </div>
              </div>

              <Link
                href="/signup"
                className="block w-full py-4 bg-white text-aire-600 font-bold text-lg rounded-xl hover:bg-gray-100 transition"
              >
                Start Your Listing
              </Link>

              <p className="text-aire-200 text-sm mt-4">
                No payment until you're ready to publish
              </p>
            </div>
          </div>

          {/* What's Included */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Everything You Need to Sell
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {included.map((item) => (
                <div key={item.title} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-aire-500/50 transition">
                  <div className="w-12 h-12 bg-aire-500/20 rounded-xl flex items-center justify-center mb-4">
                    <i className={`fas ${item.icon} text-aire-400 text-xl`} />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison */}
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 mb-16">
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              AIREA vs. Traditional Agent
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-4 px-4 text-gray-400 font-medium"></th>
                    <th className="text-center py-4 px-4 text-gray-400 font-medium">Traditional Agent</th>
                    <th className="text-center py-4 px-4 text-aire-400 font-bold">AIREA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {[
                    { label: 'Commission on $750K sale', trad: '$45,000', airea: '$499', highlight: true },
                    { label: 'Time to list', trad: '1-2 weeks', airea: '10 minutes' },
                    { label: 'MLS listing', trad: 'Yes', airea: 'Yes', both: true },
                    { label: 'AI-powered pricing', trad: 'No', airea: 'Yes' },
                    { label: '24/7 availability', trad: 'No', airea: 'Yes' },
                    { label: 'You control showings', trad: 'Agent handles', airea: 'Yes' },
                    { label: 'Digital documents', trad: 'Sometimes', airea: 'Always' },
                    { label: 'Transparent process', trad: 'Variable', airea: '100%' },
                  ].map((row) => (
                    <tr key={row.label}>
                      <td className="py-4 px-4 text-gray-300">{row.label}</td>
                      <td className={`py-4 px-4 text-center ${row.both ? 'text-white' : 'text-gray-500'}`}>
                        {row.trad}
                      </td>
                      <td className={`py-4 px-4 text-center font-semibold ${row.highlight ? 'text-aire-400 text-xl' : 'text-aire-400'}`}>
                        {row.airea}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'When do I pay the $499 fee?',
                  a: 'Payment is only required when you publish your listing. You can create your listing, get your AI valuation, and review everything before committing.'
                },
                {
                  q: 'Are there any hidden fees?',
                  a: 'No hidden fees. $499 is the total cost for listing your property. You may choose optional add-ons like professional photography, but they are clearly priced separately.'
                },
                {
                  q: 'What about buyer agent commission?',
                  a: 'You can choose to offer compensation to buyer agents (typically 2-3%) to attract more buyers. This is separate from our $499 fee and is paid at closing from the sale proceeds.'
                },
                {
                  q: 'How long is my listing active?',
                  a: 'Your listing remains active for 6 months. Extensions are available if needed, and relisting is free if your home doesn\'t sell.'
                },
                {
                  q: 'Do I need a real estate license?',
                  a: 'No. You\'re selling your own property (FSBO). AIREA handles the paperwork and compliance, and licensed support is available when you need it.'
                },
              ].map((item) => (
                <div key={item.q} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-white font-semibold mb-2">{item.q}</h3>
                  <p className="text-gray-400">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center mt-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Keep Your Commission?
            </h2>
            <Link
              href="/signup"
              className="inline-block bg-aire-500 hover:bg-aire-600 text-white px-10 py-4 rounded-xl font-bold text-lg transition"
            >
              Get Started Free
              <i className="fas fa-arrow-right ml-2" />
            </Link>
            <p className="text-gray-500 text-sm mt-3">
              No credit card required to start
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
