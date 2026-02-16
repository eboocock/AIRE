export function Features() {
  const features = [
    { icon: 'fa-magic', title: 'AI Listing Writer', description: 'Upload photos, AIREA creates compelling descriptions that sell.' },
    { icon: 'fa-search-dollar', title: 'Smart Pricing', description: 'Real-time market analysis ensures you price right from day one.' },
    { icon: 'fa-ad', title: 'Automated Marketing', description: 'Syndicated to 100+ sites with targeted social media campaigns.' },
    { icon: 'fa-calendar-check', title: 'Showing Coordinator', description: 'Buyers book directly. You approve. Smart lockbox handles access.' },
    { icon: 'fa-comments-dollar', title: 'Offer Negotiation', description: 'AI analyzes every offer and helps you negotiate the best terms.' },
    { icon: 'fa-file-signature', title: 'Digital Documents', description: 'All contracts and disclosures. Review and e-sign from your phone.' },
    { icon: 'fa-user-tie', title: 'Human Support', description: 'Licensed agents available when you need expert guidance.' },
    { icon: 'fa-shield-alt', title: 'Legal Compliance', description: 'State-specific forms and disclosures handled automatically.' },
    { icon: 'fa-mobile-alt', title: 'Mobile First', description: 'Manage your entire sale from your phone. Anytime, anywhere.' },
  ];

  return (
    <section id="features" className="py-20 px-4 bg-gray-900/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything a Realtor Does.
            <br />
            <span className="gradient-text">Without the Realtor.</span>
          </h2>
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
