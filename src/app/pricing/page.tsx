import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Pricing | AIREA',
  description: 'AIREA pricing — AI-powered FSBO tools starting at $299. Save thousands vs. traditional agent commissions.',
};

export default function PricingPage() {
  const tiers = [
    {
      name: 'DIY',
      price: 299,
      description: 'Everything you need to sell FSBO',
      features: [
        'AI property estimate',
        'AI listing description writer',
        'Photo management & organization',
        'Showing scheduler',
        'Offer management dashboard',
        'WA State document templates',
        'Email notifications',
      ],
      cta: 'Get Started',
      highlighted: false,
    },
    {
      name: 'MLS',
      price: 499,
      description: 'DIY features + MLS exposure via partner broker',
      features: [
        'Everything in DIY',
        'MLS listing via partner broker',
        'Syndication to Zillow, Redfin, etc.',
        'Professional listing review',
        'Priority support',
      ],
      cta: 'Get MLS Listing',
      highlighted: true,
      badge: 'Most Popular',
    },
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
              Sell your home FSBO with AI-powered tools. No hidden fees. No commissions.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-3xl p-8 relative overflow-hidden ${
                  tier.highlighted
                    ? 'bg-gradient-to-br from-aire-600 to-aire-800'
                    : 'bg-gray-900 border border-gray-800'
                }`}
              >
                {tier.badge && (
                  <div className="absolute top-0 right-0 bg-yellow-400 text-black px-4 py-1 text-sm font-bold rounded-bl-xl">
                    {tier.badge}
                  </div>
                )}

                <div className="mb-6">
                  <span className={`text-lg ${tier.highlighted ? 'text-aire-200' : 'text-gray-400'}`}>
                    {tier.name}
                  </span>
                  <div className="text-6xl font-black text-white mt-2">
                    ${tier.price}
                  </div>
                  <span className={tier.highlighted ? 'text-aire-200' : 'text-gray-400'}>
                    one-time payment
                  </span>
                  <p className={`text-sm mt-2 ${tier.highlighted ? 'text-aire-200' : 'text-gray-500'}`}>
                    {tier.description}
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <i className={`fas fa-check ${tier.highlighted ? 'text-aire-300' : 'text-aire-400'}`} />
                      <span className={tier.highlighted ? 'text-white' : 'text-gray-300'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/signup"
                  className={`block w-full py-4 font-bold text-lg rounded-xl text-center transition ${
                    tier.highlighted
                      ? 'bg-white text-aire-600 hover:bg-gray-100'
                      : 'bg-aire-500 text-white hover:bg-aire-600'
                  }`}
                >
                  {tier.cta}
                </Link>

                <p className={`text-sm mt-4 text-center ${tier.highlighted ? 'text-aire-200' : 'text-gray-500'}`}>
                  No payment until you're ready to publish
                </p>
              </div>
            ))}
          </div>

          {/* Savings Comparison */}
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 max-w-4xl mx-auto mb-16">
            <h2 className="text-2xl font-bold text-white text-center mb-6">
              How Much Could You Save?
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-4 px-4 text-gray-400 font-medium">Home Price</th>
                    <th className="text-center py-4 px-4 text-gray-400 font-medium">6% Agent Fee</th>
                    <th className="text-center py-4 px-4 text-aire-400 font-bold">AIREA (DIY)</th>
                    <th className="text-center py-4 px-4 text-aire-400 font-bold">You Save</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {[
                    { price: 500000, agent: 30000, airea: 299 },
                    { price: 750000, agent: 45000, airea: 299 },
                    { price: 1000000, agent: 60000, airea: 299 },
                  ].map((row) => (
                    <tr key={row.price}>
                      <td className="py-4 px-4 text-gray-300">${row.price.toLocaleString()}</td>
                      <td className="py-4 px-4 text-center text-gray-500">${row.agent.toLocaleString()}</td>
                      <td className="py-4 px-4 text-center text-aire-400 font-semibold">${row.airea}</td>
                      <td className="py-4 px-4 text-center text-aire-400 font-bold text-lg">
                        ${(row.agent - row.airea).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-500 text-xs text-center mt-4">
              Savings assume typical 6% listing + buyer agent commission.
              You may still choose to offer buyer agent compensation separately.
            </p>
          </div>

          {/* FAQ */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'When do I pay?',
                  a: 'Payment is only required when you publish your listing. You can create your listing, get your AI estimate, and review everything before committing.',
                },
                {
                  q: 'What\'s the difference between DIY and MLS?',
                  a: 'The DIY tier gives you all AI tools to manage your FSBO listing. The MLS tier adds listing on the MLS (via a partner flat-fee broker) which syndicates to Zillow, Redfin, and 100+ sites.',
                },
                {
                  q: 'What about buyer agent commission?',
                  a: 'You can choose to offer compensation to buyer\'s agents (typically 2-3%) to attract more buyers. This is separate from our fee and is paid from sale proceeds at closing.',
                },
                {
                  q: 'Do I need a real estate license to sell FSBO?',
                  a: 'No. You\'re selling your own property, which is legal in all US states. AIREA provides technology tools to help. We recommend consulting a real estate attorney for legal questions specific to your situation.',
                },
                {
                  q: 'Is AIREA a real estate brokerage?',
                  a: 'No. AIREA is a technology platform that provides AI-powered tools for FSBO sellers. We are not a licensed real estate brokerage and do not provide brokerage services. For MLS access, we partner with licensed flat-fee brokers.',
                },
                {
                  q: 'What states is AIREA available in?',
                  a: 'AIREA is currently available in Washington State. We\'re working on expanding to additional states.',
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
              Ready to Sell FSBO?
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
