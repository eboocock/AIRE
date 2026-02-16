export function Comparison() {
  const rows = [
    { label: 'Cost on $750K sale', traditional: '~$45,000 (6%)', airea: '$299–$499', aireaGood: true },
    { label: 'Time to list', traditional: '1-2 weeks', airea: '~10 minutes', aireaGood: true },
    { label: 'AI property estimate', traditional: 'No', airea: 'Yes', aireaGood: true },
    { label: 'AI listing writer', traditional: 'No', airea: 'Yes', aireaGood: true },
    { label: 'Showing management', traditional: 'Agent handles', airea: 'You control', aireaGood: true },
    { label: 'Offer dashboard', traditional: 'Agent relays', airea: 'Direct access', aireaGood: true },
    { label: 'MLS listing', traditional: 'Yes', airea: 'Via partner ($499 tier)', aireaGood: true, traditionalGood: true },
    { label: 'Document templates', traditional: 'Agent provides', airea: 'Included', aireaGood: true, traditionalGood: true },
    { label: 'You make the decisions', traditional: 'Agent advises', airea: '100%', aireaGood: true },
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Sell <span className="gradient-text">FSBO with AIREA</span>
          </h2>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden">
          <div className="grid grid-cols-3 bg-gray-800/50 p-4">
            <div />
            <div className="text-center font-bold text-gray-400">Traditional Agent</div>
            <div className="text-center font-bold text-aire-400">AIREA FSBO Tools</div>
          </div>
          {rows.map((row) => (
            <div key={row.label} className="grid grid-cols-3 p-4 border-b border-gray-800">
              <div className="text-gray-400">{row.label}</div>
              <div className={`text-center ${row.traditionalGood ? 'text-white' : 'text-gray-500'}`}>
                {row.traditional}
              </div>
              <div className={`text-center font-semibold ${row.aireaGood ? 'text-aire-400' : 'text-white'}`}>
                {row.airea}
              </div>
            </div>
          ))}
        </div>

        <p className="text-gray-500 text-xs text-center mt-4">
          AIREA is a technology platform, not a real estate brokerage. We provide tools to help you sell FSBO.
        </p>
      </div>
    </section>
  );
}
