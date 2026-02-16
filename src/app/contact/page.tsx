'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // In production, this would send to an API endpoint
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSent(true);
    setSending(false);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-950 pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Link href="/" className="text-gray-400 hover:text-white transition text-sm">
              <i className="fas fa-arrow-left mr-2" />Back to Home
            </Link>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Column */}
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">Get in Touch</h1>
              <p className="text-gray-400 text-lg mb-8">
                Have questions about selling your home with AIREA? Our team is here to help.
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-aire-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-envelope text-aire-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Email Us</h3>
                    <p className="text-gray-400">support@airea.ai</p>
                    <p className="text-gray-500 text-sm">We respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-aire-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-phone text-aire-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Call Us</h3>
                    <p className="text-gray-400">1-888-AIREA-AI</p>
                    <p className="text-gray-500 text-sm">Mon-Fri 9am-6pm PST</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-aire-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-comments text-aire-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Live Chat</h3>
                    <p className="text-gray-400">Available in dashboard</p>
                    <p className="text-gray-500 text-sm">Talk to our AI or human support</p>
                  </div>
                </div>
              </div>

              {/* FAQ Quick Links */}
              <div className="mt-12">
                <h3 className="text-lg font-semibold text-white mb-4">Common Questions</h3>
                <div className="space-y-3">
                  {[
                    'How much does AIREA cost?',
                    'How long does it take to list?',
                    'Do I need a real estate agent?',
                    'How does AI valuation work?',
                  ].map((q) => (
                    <button
                      key={q}
                      className="w-full text-left px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-gray-300 hover:border-aire-500/50 transition"
                    >
                      {q}
                      <i className="fas fa-chevron-right float-right text-gray-600" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div>
              {sent ? (
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 bg-aire-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-check text-aire-400 text-2xl" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Message Sent!</h2>
                  <p className="text-gray-400 mb-6">
                    Thanks for reaching out. We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSent(false);
                      setName('');
                      setEmail('');
                      setSubject('');
                      setMessage('');
                    }}
                    className="text-aire-400 hover:text-aire-300 font-medium"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
                  <h2 className="text-xl font-semibold text-white mb-6">Send us a message</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-aire-500"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-aire-500"
                        placeholder="you@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Subject</label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-aire-500"
                      >
                        <option value="">Select a topic</option>
                        <option value="listing">Listing my property</option>
                        <option value="pricing">Pricing questions</option>
                        <option value="technical">Technical support</option>
                        <option value="offer">Offer or showing issue</option>
                        <option value="partnership">Partnership inquiry</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        rows={5}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-aire-500 resize-y"
                        placeholder="How can we help?"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full py-3 bg-aire-500 hover:bg-aire-600 disabled:bg-aire-500/50 text-white font-semibold rounded-lg transition flex items-center justify-center"
                    >
                      {sending ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <i className="fas fa-paper-plane ml-2" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
