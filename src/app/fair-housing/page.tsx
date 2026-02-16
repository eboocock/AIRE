import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Fair Housing Statement | AIREA',
  description: 'AIREA Fair Housing Policy - Our commitment to equal housing opportunity.',
};

export default function FairHousingPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-950 pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/" className="text-gray-400 hover:text-white transition text-sm">
              <i className="fas fa-arrow-left mr-2" />Back to Home
            </Link>
          </div>

          {/* Hero Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-12 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-home text-white text-2xl" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Equal Housing Opportunity
            </h1>
            <p className="text-white/80 text-lg">
              AIREA is committed to fair housing for all
            </p>
          </div>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Our Commitment</h2>
              <p className="text-gray-300 leading-relaxed">
                AIREA is committed to complying fully with all federal, state, and local fair housing laws.
                We believe everyone deserves equal access to housing opportunities regardless of their
                background or identity.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">The Fair Housing Act</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                The Fair Housing Act prohibits discrimination in the sale, rental, and financing of housing
                based on:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: 'fa-users', label: 'Race' },
                  { icon: 'fa-palette', label: 'Color' },
                  { icon: 'fa-praying-hands', label: 'Religion' },
                  { icon: 'fa-flag', label: 'National Origin' },
                  { icon: 'fa-venus-mars', label: 'Sex' },
                  { icon: 'fa-child', label: 'Familial Status' },
                  { icon: 'fa-wheelchair', label: 'Disability' },
                  { icon: 'fa-shield-alt', label: 'Protected Status' },
                ].map((item) => (
                  <div key={item.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
                    <i className={`fas ${item.icon} text-aire-400 text-xl mb-2`} />
                    <div className="text-gray-300 text-sm font-medium">{item.label}</div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">State and Local Protections</h2>
              <p className="text-gray-300 leading-relaxed">
                Many states and localities provide additional protections against discrimination based on:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mt-4">
                <li>Sexual orientation and gender identity</li>
                <li>Source of income</li>
                <li>Age</li>
                <li>Marital status</li>
                <li>Veteran or military status</li>
                <li>Genetic information</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                AIREA complies with all applicable state and local fair housing requirements in the
                jurisdictions where we operate.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Our AI Systems</h2>
              <div className="bg-aire-500/10 border border-aire-500/30 rounded-lg p-4 mb-4">
                <p className="text-aire-400 font-medium mb-2">
                  <i className="fas fa-robot mr-2" />AI Fairness Commitment
                </p>
                <p className="text-gray-300">
                  We design and monitor our AI systems to prevent discriminatory outcomes in property
                  valuations, listing recommendations, and buyer matching.
                </p>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Our AI models are regularly audited for bias and do not use protected characteristics
                in their decision-making processes. We are committed to algorithmic fairness and
                transparency in all AI-assisted features.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Prohibited Conduct</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                When using AIREA, users must not:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Refuse to sell or show property based on protected characteristics</li>
                <li>Discriminate in terms, conditions, or privileges of sale</li>
                <li>Make discriminatory statements in listings or communications</li>
                <li>Steer buyers toward or away from certain neighborhoods</li>
                <li>Deny or limit services based on protected status</li>
                <li>Retaliate against anyone exercising fair housing rights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Accessibility</h2>
              <p className="text-gray-300 leading-relaxed">
                AIREA is committed to accessibility for users with disabilities. We strive to make our
                platform accessible and compliant with WCAG guidelines. If you encounter accessibility
                issues, please contact us at accessibility@airea.ai.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Reporting Discrimination</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                If you believe you have experienced housing discrimination, you may:
              </p>
              <div className="space-y-4">
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2">Report to AIREA</h4>
                  <p className="text-gray-400 text-sm">fairhousing@airea.ai</p>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2">File a HUD Complaint</h4>
                  <p className="text-gray-400 text-sm">1-800-669-9777 or portal.hud.gov/hudportal/HUD</p>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2">Contact Local Fair Housing Agency</h4>
                  <p className="text-gray-400 text-sm">Find your local agency at hud.gov/fairhousing</p>
                </div>
              </div>
            </section>

            <section className="border-t border-gray-800 pt-8">
              <div className="flex items-center justify-center space-x-4 text-gray-400">
                <i className="fas fa-home text-2xl" />
                <span className="text-lg font-medium">Equal Housing Opportunity</span>
              </div>
              <p className="text-center text-gray-500 text-sm mt-4">
                We are pledged to the letter and spirit of U.S. policy for the achievement of equal
                housing opportunity throughout the Nation.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
