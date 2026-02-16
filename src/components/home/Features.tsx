export function Features() {
  const features = [
    { icon: 'fa-brain', title: 'AI Property Estimates', description: 'Get an instant estimate based on comparable sales and market data.' },
    { icon: 'fa-magic', title: 'AI Listing Writer', description: 'Upload photos and let AI create a compelling listing description.' },
    { icon: 'fa-search-dollar', title: 'Pricing Insights', description: 'See comparable sales and market trends to help you set the right price.' },
    { icon: 'fa-calendar-check', title: 'Showing Scheduler', description: 'Buyers request showings. You approve or suggest a different time.' },
    { icon: 'fa-comments-dollar', title: 'Offer Management', description: 'Review, compare, and respond to offers from your dashboard.' },
    { icon: 'fa-file-alt', title: 'Document Templates', description: 'Access Washington State FSBO document templates. Consult an attorney for legal advice.' },
    { icon: 'fa-camera', title: 'Photo Management', description: 'Upload, organize, and showcase your property photos.' },
    { icon: 'fa-shield-alt', title: 'WA State Resources', description: 'Links to official Washington State seller disclosure forms and requirements.' },
    { icon: 'fa-mobile-alt', title: 'Mobile Friendly', description: 'Manage your listing from any device. Review offers on the go.' },
  ];

  return (
    <section id="features" className="py-20 px-4 bg-gray-900/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            AI-Powered Tools for
            <br />
            <span className="gradient-text">FSBO Sellers</span>
          </h2>
          <p className="text-gray-400 text-lg">Everything you need to sell your home yourself</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-aire-500/50 transition">
              <div className="w-12 h-12 bg-aire-500/20 rounded-xl flex items-center justify-center mb-4">
                <i className={`fas ${feature.icon} text-aire-400 text-xl`} />
              </div>
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
