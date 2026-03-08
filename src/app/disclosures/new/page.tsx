'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewDisclosurePage() {
  const router = useRouter();
  const [step, setStep] = useState<'form_select' | 'property'>('form_select');
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const [address, setAddress] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [yearBuilt, setYearBuilt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const forms = [
    {
      code: 'WA_FORM_17',
      name: 'WA Seller Disclosure Statement',
      subtitle: 'Form 17 · Required for all WA residential sales',
      description: 'Covers title, water, sewer, structural, systems, HOA, environmental, permits, and full disclosure. Required under RCW 64.06.',
      questions: 34,
      required: true,
      icon: 'fa-file-contract',
    },
    {
      code: 'FEDERAL_LEAD_PAINT',
      name: 'Lead-Based Paint Disclosure',
      subtitle: 'Federal · Required for homes built before 1978',
      description: 'Federal law requires sellers of pre-1978 homes to disclose known lead-based paint and hazards.',
      questions: 3,
      required: parseInt(yearBuilt) > 0 && parseInt(yearBuilt) < 1978,
      icon: 'fa-exclamation-triangle',
    },
  ];

  const handleStart = async () => {
    if (!selectedForm || !address.trim() || !sellerName.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/disclosures/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_code: selectedForm,
          state: 'WA',
          property_address: address.trim(),
          seller_name: sellerName.trim(),
          property_data: yearBuilt ? { year_built: parseInt(yearBuilt) } : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to start disclosure');

      router.push(`/disclosures/${data.id}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/disclosures" className="text-gray-400 hover:text-white text-sm flex items-center gap-2 mb-4">
            <i className="fas fa-arrow-left" /> Back to Disclosures
          </Link>
          <h1 className="text-3xl font-bold text-white">Start a Disclosure</h1>
          <p className="text-gray-400 mt-2">Select a form and enter your property details to begin.</p>
        </div>

        {/* Select Form */}
        <div className="space-y-4 mb-8">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Select Disclosure Form</h2>
          {forms.map(form => (
            <button
              key={form.code}
              onClick={() => setSelectedForm(form.code)}
              className={`w-full text-left p-5 rounded-xl border transition ${
                selectedForm === form.code
                  ? 'bg-aire-500/10 border-aire-500'
                  : 'bg-gray-900 border-gray-800 hover:border-gray-600'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  selectedForm === form.code ? 'bg-aire-500/20' : 'bg-gray-800'
                }`}>
                  <i className={`fas ${form.icon} ${selectedForm === form.code ? 'text-aire-400' : 'text-gray-400'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-white">{form.name}</span>
                    {form.required && (
                      <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">Required</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{form.subtitle}</div>
                  <div className="text-sm text-gray-400 mt-2">{form.description}</div>
                  <div className="text-xs text-gray-500 mt-2">
                    <i className="fas fa-list-ul mr-1" />{form.questions} questions
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-1 flex items-center justify-center ${
                  selectedForm === form.code ? 'border-aire-500 bg-aire-500' : 'border-gray-600'
                }`}>
                  {selectedForm === form.code && <i className="fas fa-check text-white text-xs" />}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Property Details */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Property Details</h2>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Property Address <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="123 Main St, Seattle, WA 98101"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-aire-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Seller Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={sellerName}
                onChange={e => setSellerName(e.target.value)}
                placeholder="John Smith"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-aire-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Year Built</label>
              <input
                type="number"
                value={yearBuilt}
                onChange={e => setYearBuilt(e.target.value)}
                placeholder="1995"
                min="1800"
                max={new Date().getFullYear()}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-aire-500"
              />
            </div>
          </div>

          {yearBuilt && parseInt(yearBuilt) < 1978 && (
            <div className="flex items-start gap-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <i className="fas fa-exclamation-triangle text-yellow-400 mt-0.5" />
              <p className="text-sm text-yellow-300">
                This property was built before 1978. Federal law requires a Lead-Based Paint Disclosure in addition to the WA Form 17.
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            <i className="fas fa-exclamation-circle mr-2" />{error}
          </div>
        )}

        <button
          onClick={handleStart}
          disabled={!selectedForm || !address.trim() || !sellerName.trim() || loading}
          className="w-full mt-6 py-4 bg-aire-500 hover:bg-aire-600 disabled:bg-gray-800 disabled:text-gray-500 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <><i className="fas fa-spinner fa-spin" /> Starting...</>
          ) : (
            <><i className="fas fa-play" /> Start Disclosure</>
          )}
        </button>
      </div>
    </div>
  );
}
