export function DocumentationSection() {
  const categories = [
    { category: 'Listing Documents', score: 98.2, icon: 'fa-file-alt', docs: ['Listing Agreement', 'MLS Data Entry', 'Property Description', 'Photo Compliance'] },
    { category: 'Seller Disclosures', score: 97.8, icon: 'fa-clipboard-check', docs: ['Seller Disclosure Statement', 'Lead Paint Disclosure', 'Property Condition Report', 'HOA Documents'] },
    { category: 'Purchase Agreement', score: 96.5, icon: 'fa-handshake', docs: ['Purchase & Sale Agreement', 'Addenda & Amendments', 'Contingency Clauses', 'Earnest Money Receipt'] },
    { category: 'Negotiation & Offers', score: 97.1, icon: 'fa-comments-dollar', docs: ['Offer Review & Analysis', 'Counter-Offer Drafting', 'Multi-Offer Management', 'Terms Comparison'] },
    { category: 'Closing Documents', score: 98.0, icon: 'fa-stamp', docs: ['Closing Disclosure', 'Title Documents', 'Transfer Documents', 'Final Walkthrough Report'] },
    { category: 'Compliance & Legal', score: 96.9, icon: 'fa-shield-alt', docs: ['Fair Housing Compliance', 'State Regulation Adherence', 'RESPA Compliance', 'E-Signature Validity'] },
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            AI-Powered <span className="gradient-text">Documentation & Compliance</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            The #1 concern with selling without an agent: "Who handles the paperwork?"
            AIREA does — with independently verified accuracy scores.
          </p>
        </div>

        {/* Eval Score Hero */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 rounded-3xl p-8 mb-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="relative w-40 h-40">
                <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="#1f2937" strokeWidth="8" />
                  <circle cx="60" cy="60" r="54" fill="none" stroke="#22c55e" strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 54 * 0.974} ${2 * Math.PI * 54 * (1 - 0.974)}`}
                    strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-white">97.4%</span>
                  <span className="text-xs text-gray-400">Overall Score</span>
                </div>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center bg-aire-500/10 border border-aire-500/30 rounded-full px-3 py-1 mb-3">
                <i className="fas fa-flask text-aire-400 mr-2 text-sm" />
                <span className="text-aire-400 text-sm font-medium">Independently Evaluated</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">AIREA Documentation Accuracy Score</h3>
              <p className="text-gray-400 mb-4">
                We continuously evaluate AIREA's ability to generate, review, and manage every document required
                in a real estate transaction. Our eval suite tests against 1,200+ real transaction scenarios.
              </p>
            </div>
          </div>
        </div>

        {/* Document Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat.category} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-aire-500/50 transition">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-aire-500/20 rounded-xl flex items-center justify-center">
                  <i className={`fas ${cat.icon} text-aire-400 text-xl`} />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-aire-400">{cat.score}%</div>
                  <div className="text-xs text-gray-500">Eval Score</div>
                </div>
              </div>
              <h3 className="font-bold text-lg mb-3">{cat.category}</h3>
              <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
                <div className="bg-aire-500 h-2 rounded-full" style={{ width: `${cat.score}%` }} />
              </div>
              <div className="space-y-1">
                {cat.docs.map((doc) => (
                  <div key={doc} className="flex items-center gap-2 text-sm text-gray-400">
                    <i className="fas fa-check text-aire-400 text-xs" />
                    {doc}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
