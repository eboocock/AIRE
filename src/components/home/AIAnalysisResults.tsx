'use client';

import { useState } from 'react';
import type { AIValuation } from '@/types/database';

interface AIAnalysisResultsProps {
  analysis: any;
  onGetStarted: () => void;
}

export function AIAnalysisResults({ analysis, onGetStarted }: AIAnalysisResultsProps) {
  const [activeTab, setActiveTab] = useState('valuation');

  const property = analysis.property_data || {};
  const market = analysis.market_data || {};
  const comps = analysis.comparables || [];
  const improvements = analysis.improvements || [];

  const savings = Math.round((analysis.estimated_value || 0) * 0.06) - 499;

  return (
    <div className="animate-slide-up">
      {/* Valuation Header */}
      <div className="bg-gradient-to-r from-aire-600 to-aire-800 rounded-3xl p-8 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <i className="fas fa-robot text-aire-300" />
              <span className="text-aire-200 text-sm font-medium">
                AI Valuation Complete
              </span>
              {analysis.confidence_score && (
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs text-white/90 ml-2">
                  {analysis.confidence_score}% confidence
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-white">
              {analysis.street_address}
            </h2>
            <div className="text-aire-200 text-sm mt-1">
              {property.beds || 4} bed • {property.baths || 2.5} bath •{' '}
              {(property.sqft || 2450).toLocaleString()} sqft • Built{' '}
              {property.yearBuilt || 2005}
            </div>
          </div>
          <div className="text-left md:text-right">
            <div className="text-aire-200 text-sm">Estimated Market Value</div>
            <div className="text-4xl md:text-5xl font-black text-white">
              ${(analysis.estimated_value || 0).toLocaleString()}
            </div>
            <div className="text-aire-200 text-sm">
              ${(analysis.value_low || 0).toLocaleString()} - $
              {(analysis.value_high || 0).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Savings Banner */}
        <div className="mt-6 bg-white/10 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <div className="text-white font-semibold">Sell with AIRE and save</div>
            <div className="text-aire-200 text-sm">
              vs. 6% traditional agent commission
            </div>
          </div>
          <div className="text-3xl font-black text-white">
            ${savings.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {[
          { id: 'valuation', label: 'AI Valuation', icon: 'fa-chart-line' },
          { id: 'listing', label: 'AI Listing', icon: 'fa-file-alt' },
          { id: 'market', label: 'Market Intel', icon: 'fa-broadcast-tower' },
          { id: 'improvements', label: 'AI Advisor', icon: 'fa-lightbulb' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 rounded-xl font-semibold whitespace-nowrap transition flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-aire-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <i className={`fas ${tab.icon}`} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        {activeTab === 'valuation' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <i className="fas fa-brain text-aire-400" />
                How AI Calculated Your Value
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <div className="text-gray-400 text-sm">Price per Sq Ft</div>
                  <div className="text-2xl font-bold">
                    ${analysis.price_per_sqft || 500}
                  </div>
                  <div className="text-xs text-gray-500">
                    Based on {analysis.city} comps
                  </div>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <div className="text-gray-400 text-sm">Confidence Score</div>
                  <div className="text-2xl font-bold text-aire-400">
                    {analysis.confidence_score || 75}%
                  </div>
                  <div className="text-xs text-gray-500">Analysis accuracy</div>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <div className="text-gray-400 text-sm">Data Points</div>
                  <div className="text-2xl font-bold">2,847</div>
                  <div className="text-xs text-gray-500">Sales, listings, trends</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Comparable Sales</h4>
              <div className="space-y-3">
                {comps.length > 0 ? (
                  comps.map((comp: any, idx: number) => (
                    <div
                      key={idx}
                      className="bg-gray-800/50 rounded-xl p-4 flex justify-between items-center"
                    >
                      <div>
                        <div className="font-medium">{comp.address}</div>
                        <div className="text-gray-500 text-sm">
                          {(comp.sqft || 0).toLocaleString()} sqft
                        </div>
                      </div>
                      <div className="text-xl font-bold">
                        ${(comp.price || 0).toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 text-center py-4">
                    No comparable sales data available
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'listing' && (
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <i className="fas fa-magic text-aire-400" />
              AI-Generated Listing Description
            </h3>
            <div className="bg-gray-800/50 rounded-xl p-6">
              <div className="prose prose-invert max-w-none">
                {(analysis.listing_description || '').split('\n\n').map(
                  (paragraph: string, idx: number) => (
                    <p key={idx} className="text-gray-300 mb-4 leading-relaxed">
                      {paragraph}
                    </p>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'market' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <i className="fas fa-broadcast-tower text-aire-400" />
              {analysis.city} Market Intelligence
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                <div className="text-3xl font-black text-red-400">
                  {market.marketTemp === 'hot' ? '🔥' : '☀️'}
                </div>
                <div className="text-lg font-bold capitalize">
                  {market.marketTemp || 'Warm'} Market
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                <div className="text-3xl font-black text-aire-400">
                  {market.daysOnMarket || 21}
                </div>
                <div className="text-lg font-bold">Avg Days on Market</div>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                <div className="text-3xl font-black text-purple-400">
                  {market.schoolRating || 8}/10
                </div>
                <div className="text-lg font-bold">School Rating</div>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                <div className="text-3xl font-black text-blue-400">
                  {market.walkScore || 65}
                </div>
                <div className="text-lg font-bold">Walk Score</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'improvements' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <i className="fas fa-lightbulb text-aire-400" />
              AI-Recommended Improvements
            </h3>
            <div className="space-y-4">
              {improvements.map((imp: any, idx: number) => (
                <div key={idx} className="bg-gray-800/50 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold">{imp.item}</div>
                      <div className="text-sm text-gray-500">
                        Est. cost: ${(imp.cost || 0).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-aire-400 font-bold">
                        +${(imp.addedValue || 0).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">{imp.roi} ROI</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="mt-6 text-center">
        <button
          onClick={onGetStarted}
          className="bg-aire-500 hover:bg-aire-600 text-white px-10 py-4 rounded-xl font-bold text-lg transition shadow-lg shadow-aire-500/25"
        >
          List My Home with AIRE
          <i className="fas fa-arrow-right ml-2" />
        </button>
        <p className="text-gray-500 text-sm mt-3">
          Save ${savings.toLocaleString()} vs. traditional agent • No upfront costs
        </p>
      </div>
    </div>
  );
}
