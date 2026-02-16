export function HowItWorks() {
  const steps = [
    { number: '1', icon: 'fa-home', title: 'Enter Your Address', description: 'Get a free AI property estimate and see how much you could save selling FSBO.' },
    { number: '2', icon: 'fa-pen', title: 'Create Your Listing', description: 'Our AI writes a professional listing description. Add photos and set your price.' },
    { number: '3', icon: 'fa-calendar-check', title: 'Manage Showings & Offers', description: 'Coordinate showings from your dashboard. Review and compare offers as they come in.' },
    { number: '4', icon: 'fa-handshake', title: 'Close the Sale', description: 'Use our document templates and close on your terms. We recommend consulting an attorney.' },
  ];

  return (
    <section id="how-it-works" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Sell FSBO in <span className="gradient-text">4 Simple Steps</span>
          </h2>
          <p className="text-gray-400 text-lg">AIREA gives you the tools — you make the decisions</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="w-16 h-16 bg-gray-800 border border-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4 relative">
                <i className={`fas ${step.icon} text-aire-400 text-2xl`} />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-aire-500 rounded-full flex items-center justify-center text-xs font-bold">
                  {step.number}
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2">{step.title}</h3>
              <p className="text-gray-400 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
