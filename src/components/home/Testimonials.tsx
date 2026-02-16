export function Testimonials() {
  const testimonials = [
    { quote: 'I saved $38,000 selling my Seattle home. The AI priced it perfectly—sold in 5 days with multiple offers.', name: 'Michael T.', location: 'Seattle, WA', saved: '$38,000' },
    { quote: 'The mobile app made everything so easy. Took photos, approved showings, signed documents—all from my phone.', name: 'Sarah L.', location: 'Bellevue, WA', saved: '$27,500' },
    { quote: 'I was skeptical about selling without an agent, but AIREA\'s support team was there whenever I needed them.', name: 'David & Maria R.', location: 'Tacoma, WA', saved: '$31,200' },
  ];

  return (
    <section className="py-20 px-4 bg-gray-900/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Trusted by <span className="gradient-text">Smart Sellers</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center text-aire-400 mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <i key={i} className="fas fa-star text-sm mr-1" />
                ))}
              </div>
              <p className="text-gray-300 mb-6">"{t.quote}"</p>
              <div className="flex justify-between items-end">
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-gray-500 text-sm">{t.location}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Saved</div>
                  <div className="text-aire-400 font-bold">{t.saved}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
