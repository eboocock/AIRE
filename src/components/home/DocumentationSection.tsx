export function DocumentationSection() {
  const resources = [
    {
      category: 'Seller Disclosures',
      icon: 'fa-clipboard-check',
      items: [
        'WA Seller Disclosure Statement (Form 17)',
        'Lead-Based Paint Disclosure (pre-1978)',
        'Agency Disclosure',
        'Property condition documentation',
      ],
    },
    {
      category: 'Listing Resources',
      icon: 'fa-file-alt',
      items: [
        'AI-generated listing description',
        'Photo organization tools',
        'Pricing insights from comparable sales',
        'Showing scheduler',
      ],
    },
    {
      category: 'Offer Management',
      icon: 'fa-comments-dollar',
      items: [
        'Side-by-side offer comparison',
        'Key terms at a glance',
        'Response tracking',
        'Email notifications',
      ],
    },
    {
      category: 'Closing Guidance',
      icon: 'fa-handshake',
      items: [
        'Links to WA State closing requirements',
        'Title company referral resources',
        'Timeline tracking',
        'Attorney consultation recommended',
      ],
    },
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Washington State <span className="gradient-text">FSBO Resources</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            AIREA provides tools, templates, and links to help you navigate selling
            FSBO in Washington State. For legal advice, we recommend consulting a
            licensed real estate attorney.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {resources.map((res) => (
            <div key={res.category} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-aire-500/50 transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-aire-500/20 rounded-xl flex items-center justify-center">
                  <i className={`fas ${res.icon} text-aire-400 text-xl`} />
                </div>
                <h3 className="font-bold text-lg">{res.category}</h3>
              </div>
              <div className="space-y-2">
                {res.items.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-gray-400">
                    <i className="fas fa-check text-aire-400 text-xs" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-gray-900 border border-gray-800 rounded-xl text-center">
          <p className="text-gray-500 text-sm">
            <i className="fas fa-info-circle mr-1" />
            AIREA provides document templates and resource links for informational purposes.
            We are not a law firm or licensed brokerage. Consult a licensed attorney for legal advice.
          </p>
        </div>
      </div>
    </section>
  );
}
