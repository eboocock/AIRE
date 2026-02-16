import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service | AIREA',
  description: 'AIREA Terms of Service - Terms and conditions for using our AI real estate platform.',
};

export default function TermsPage() {
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

          <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-gray-400 mb-8">Last updated: February 2026</p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Agreement to Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                By accessing or using AIREA ("the Platform"), you agree to be bound by these Terms of Service.
                If you do not agree to these terms, do not use our services. AIREA Technologies Inc. reserves
                the right to modify these terms at any time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Services</h2>
              <p className="text-gray-300 leading-relaxed">
                AIREA provides an AI-powered real estate platform that enables users to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mt-4">
                <li>Receive AI-generated property valuations and market analysis</li>
                <li>Create and manage property listings</li>
                <li>Receive and respond to buyer offers</li>
                <li>Schedule and manage property showings</li>
                <li>Generate real estate documentation with AI assistance</li>
                <li>Distribute listings to MLS and partner platforms</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Account Registration</h2>
              <p className="text-gray-300 leading-relaxed">
                To access certain features, you must create an account. You agree to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mt-4">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of unauthorized access</li>
                <li>Be responsible for all activities under your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Fees and Payments</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                AIREA charges a flat fee of <strong>$499</strong> to list your property. This fee includes:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>AI-powered property valuation</li>
                <li>AI-generated listing descriptions</li>
                <li>MLS listing distribution</li>
                <li>Showing coordination tools</li>
                <li>Offer management system</li>
                <li>Digital document generation</li>
                <li>Customer support</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                Fees are non-refundable once your listing is published. Additional services may incur separate charges.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. AI-Generated Content Disclaimer</h2>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
                <p className="text-yellow-400 font-medium mb-2">
                  <i className="fas fa-exclamation-triangle mr-2" />Important
                </p>
                <p className="text-gray-300">
                  AI-generated valuations, descriptions, and recommendations are provided for informational purposes
                  only and should not be considered as professional real estate appraisals or legal advice.
                </p>
              </div>
              <p className="text-gray-300 leading-relaxed">
                While we strive for accuracy, AI analysis may not account for all factors affecting property value.
                We recommend consulting with licensed professionals for critical decisions. AIREA is not liable for
                decisions made based on AI-generated content.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. User Responsibilities</h2>
              <p className="text-gray-300 leading-relaxed">As a user, you agree to:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mt-4">
                <li>Provide accurate property information and disclosures</li>
                <li>Comply with all applicable real estate laws and regulations</li>
                <li>Not misrepresent property conditions or features</li>
                <li>Respond to legitimate buyer inquiries in good faith</li>
                <li>Complete required seller disclosures honestly</li>
                <li>Not use the platform for fraudulent purposes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Intellectual Property</h2>
              <p className="text-gray-300 leading-relaxed">
                AIREA and its content, features, and functionality are owned by AIREA Technologies Inc.
                You may not copy, modify, distribute, or create derivative works without our permission.
                You retain ownership of content you submit but grant us a license to use it for providing services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Limitation of Liability</h2>
              <p className="text-gray-300 leading-relaxed">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, AIREA SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
                SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR GOODWILL,
                ARISING FROM YOUR USE OF THE PLATFORM. OUR TOTAL LIABILITY SHALL NOT EXCEED THE FEES PAID
                BY YOU IN THE TWELVE MONTHS PRECEDING THE CLAIM.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Indemnification</h2>
              <p className="text-gray-300 leading-relaxed">
                You agree to indemnify and hold harmless AIREA, its officers, directors, employees, and agents
                from any claims, damages, or expenses arising from your use of the platform, violation of these
                terms, or infringement of any third-party rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Termination</h2>
              <p className="text-gray-300 leading-relaxed">
                We may terminate or suspend your account at any time for violations of these terms.
                Upon termination, your right to use the platform ceases immediately. Provisions that
                by their nature should survive termination will remain in effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">11. Dispute Resolution</h2>
              <p className="text-gray-300 leading-relaxed">
                Any disputes arising from these terms shall be resolved through binding arbitration
                in accordance with the rules of the American Arbitration Association. You waive any right
                to participate in class actions. Small claims court actions are permitted.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">12. Governing Law</h2>
              <p className="text-gray-300 leading-relaxed">
                These Terms shall be governed by the laws of the State of Washington, without regard
                to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">13. Contact</h2>
              <p className="text-gray-300 leading-relaxed">
                For questions about these Terms, contact us at:
              </p>
              <div className="mt-4 p-4 bg-gray-900 border border-gray-800 rounded-lg">
                <p className="text-gray-300">AIREA Technologies Inc.</p>
                <p className="text-gray-300">Email: legal@airea.ai</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
