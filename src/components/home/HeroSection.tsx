'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AddressAutocomplete } from '@/components/ui/AddressAutocomplete';
import { AIAnalysisResults } from '@/components/home/AIAnalysisResults';
import { analyzeProperty } from '@/lib/api/property';
import type { AIValuation } from '@/types/database';

export function HeroSection() {
  const router = useRouter();
  const [address, setAddress] = useState('');
  const [addressDetails, setAddressDetails] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [analysis, setAnalysis] = useState<AIValuation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analysisSteps = [
    { key: 'property', label: 'Fetching property records...', icon: 'fa-home' },
    { key: 'comps', label: 'Analyzing comparable sales...', icon: 'fa-chart-bar' },
    { key: 'market', label: 'Evaluating market conditions...', icon: 'fa-broadcast-tower' },
    { key: 'valuation', label: 'Generating AI valuation...', icon: 'fa-brain' },
    { key: 'listing', label: 'Writing listing description...', icon: 'fa-file-alt' },
    { key: 'strategy', label: 'Calculating pricing strategy...', icon: 'fa-calculator' },
    { key: 'complete', label: 'Finalizing analysis...', icon: 'fa-check-circle' },
  ];

  const runAnalysis = async () => {
    if (!address) return;

    setAnalyzing(true);
    setAnalysisStep(0);
    setAnalysis(null);
    setError(null);

    try {
      // Run analysis with progress updates
      const result = await analyzeProperty(address, addressDetails, (step) => {
        setAnalysisStep(step);
      });

      setAnalysis(result);
    } catch (err: any) {
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleGetStarted = () => {
    // Store analysis in session and redirect to signup/onboarding
    if (analysis) {
      sessionStorage.setItem('aireAnalysis', JSON.stringify(analysis));
    }
    router.push('/signup?from=analysis');
  };

  return (
    <section className="pt-24 pb-12 px-4 relative overflow-hidden min-h-screen">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-aire-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-aire-600/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-up">
          <div className="inline-flex items-center bg-aire-500/10 border border-aire-500/30 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-aire-400 rounded-full mr-2 animate-pulse" />
            <span className="text-aire-400 text-sm font-medium">
              FSBA<span className="text-aire-300">I</span> — For Sale By AI
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
            Your AI Real Estate Agent
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Enter your address and watch AIRE analyze your property in real-time.
            Get instant valuation, market insights, and a professional listing —
            powered by AI.
          </p>
        </div>

        {/* AI Analysis Input */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 glow">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <i className="fas fa-map-marker-alt absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 z-10" />
                <AddressAutocomplete
                  value={address}
                  onChange={setAddress}
                  onSelect={setAddressDetails}
                  placeholder="Enter your property address..."
                  disabled={analyzing}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-aire-500 text-lg"
                />
              </div>
              <button
                onClick={runAnalysis}
                disabled={!address || analyzing}
                className="bg-aire-500 hover:bg-aire-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-bold transition flex items-center justify-center whitespace-nowrap"
              >
                {analyzing ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <i className="fas fa-brain mr-2" />
                    Analyze with AI
                  </>
                )}
              </button>
            </div>

            {/* Analysis Progress */}
            {analyzing && (
              <div className="mt-6 space-y-2">
                {analysisSteps.map((step, idx) => (
                  <div
                    key={step.key}
                    className={`flex items-center space-x-3 transition-all duration-300 ${
                      idx < analysisStep
                        ? 'opacity-100'
                        : idx === analysisStep
                        ? 'opacity-100'
                        : 'opacity-30'
                    }`}
                  >
                    <div className="w-6 flex justify-center">
                      {idx < analysisStep ? (
                        <i className="fas fa-check-circle text-aire-400" />
                      ) : idx === analysisStep ? (
                        <i className={`fas ${step.icon} fa-spin text-aire-400`} />
                      ) : (
                        <i className="fas fa-circle text-gray-600 text-xs" />
                      )}
                    </div>
                    <span
                      className={`text-sm ${
                        idx <= analysisStep ? 'text-white' : 'text-gray-500'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                <i className="fas fa-exclamation-circle mr-2" />
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Analysis Results */}
        {analysis && (
          <AIAnalysisResults analysis={analysis} onGetStarted={handleGetStarted} />
        )}

        {/* Pre-analysis prompt */}
        {!analysis && !analyzing && (
          <div className="text-center text-gray-500 mt-8">
            <i className="fas fa-arrow-up text-aire-400 text-2xl mb-3 animate-bounce" />
            <p>Enter your address above to see AIRE in action</p>
          </div>
        )}
      </div>
    </section>
  );
}
