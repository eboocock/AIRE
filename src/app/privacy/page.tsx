import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy | AIREA',
  description: 'AIREA Privacy Policy - How we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
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

          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-gray-400 mb-8">Last updated: February 2026</p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
              <p className="text-gray-300 leading-relaxed">
                AIREA Technologies Inc. ("AIREA," "we," "us," or "our") is committed to protecting your privacy.
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when
                you use our AI-powered real estate platform and services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>
              <h3 className="text-lg font-medium text-white mt-4 mb-2">Personal Information</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Name, email address, phone number</li>
                <li>Property addresses and details you provide</li>
                <li>Payment information (processed securely via Stripe)</li>
                <li>Account credentials</li>
              </ul>

              <h3 className="text-lg font-medium text-white mt-4 mb-2">Automatically Collected Information</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Device and browser information</li>
                <li>IP address and location data</li>
                <li>Usage patterns and interactions with our platform</li>
                <li>Cookies and similar technologies</li>
              </ul>

              <h3 className="text-lg font-medium text-white mt-4 mb-2">Third-Party Data</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Property data from real estate databases</li>
                <li>Public records information</li>
                <li>MLS listing data (when applicable)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Provide AI-powered property valuations and analysis</li>
                <li>Create and manage your property listings</li>
                <li>Facilitate communications between buyers and sellers</li>
                <li>Process payments and transactions</li>
                <li>Send notifications about offers, showings, and important updates</li>
                <li>Improve our AI models and platform features</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Information Sharing</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We do not sell your personal information. We may share information with:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li><strong>Service Providers:</strong> Third parties that help us operate our platform (payment processing, email, analytics)</li>
                <li><strong>MLS and Real Estate Networks:</strong> To list your property on multiple platforms</li>
                <li><strong>Legal Compliance:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Data Security</h2>
              <p className="text-gray-300 leading-relaxed">
                We implement industry-standard security measures including encryption, secure servers, and regular security audits.
                However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Your Rights</h2>
              <p className="text-gray-300 leading-relaxed mb-4">You have the right to:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Data portability</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                To exercise these rights, contact us at privacy@airea.ai
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. California Privacy Rights (CCPA)</h2>
              <p className="text-gray-300 leading-relaxed">
                California residents have additional rights under the CCPA, including the right to know what personal information
                is collected, the right to deletion, and the right to opt-out of the sale of personal information.
                We do not sell personal information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Cookies</h2>
              <p className="text-gray-300 leading-relaxed">
                We use cookies and similar technologies to enhance your experience. You can control cookie preferences
                through your browser settings. Disabling cookies may limit some platform features.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Children's Privacy</h2>
              <p className="text-gray-300 leading-relaxed">
                Our services are not directed to individuals under 18. We do not knowingly collect personal information
                from children. If we learn we have collected such information, we will delete it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Changes to This Policy</h2>
              <p className="text-gray-300 leading-relaxed">
                We may update this Privacy Policy periodically. We will notify you of material changes by posting
                the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">11. Contact Us</h2>
              <p className="text-gray-300 leading-relaxed">
                If you have questions about this Privacy Policy or our practices, contact us at:
              </p>
              <div className="mt-4 p-4 bg-gray-900 border border-gray-800 rounded-lg">
                <p className="text-gray-300">AIREA Technologies Inc.</p>
                <p className="text-gray-300">Email: privacy@airea.ai</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
