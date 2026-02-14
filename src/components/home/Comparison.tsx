export function Comparison() {
  const rows = [
    { label: 'Commission', traditional: '6% ($45,000)', aire: '$499 flat', aireGood: true },
    { label: 'Time to List', traditional: '1-2 weeks', aire: '10 minutes', aireGood: true },
    { label: '24/7 Availability', traditional: 'No', aire: 'Yes', aireGood: true },
    { label: 'MLS Listing', traditional: 'Yes', aire: 'Yes', aireGood: true, traditionalGood: true },
    { label: 'AI Pricing Analysis', traditional: 'No', aire: 'Yes', aireGood: true },
    { label: 'Automated Showings', traditional: 'No', aire: 'Yes', aireGood: true },
    { label: 'Digital Documents', traditional: 'Sometimes', aire: 'Always', aireGood: true },
    { label: 'Doc Accuracy Score', traditional: 'Unverified', aire: '97.4% Eval\'d', aireGood: true },
    { label: 'You\'re in Control', traditional: 'No', aire: '100%', aireGood: true },
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Sellers <span className="gradient-text">Choose AIRE</span>
          </h2>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden">
          <div className="grid grid-cols-3 bg-gray-800/50 p-4">
            <div />
            <div className="text-center font-bold text-gray-400">Traditional Agent</div>
            <div className="text-center font-bold text-aire-400">AIRE</div>
          </div>
          {rows.map((row) => (
            <div key={row.label} className="grid grid-cols-3 p-4 border-b border-gray-800">
              <div className="text-gray-400">{row.label}</div>
              <div className={`text-center ${row.traditionalGood ? 'text-white' : 'text-gray-500'}`}>
                {row.traditional}
              </div>
              <div className={`text-center font-semibold ${row.aireGood ? 'text-aire-400' : 'text-white'}`}>
                {row.aire}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
