export function Testimonials() {
  return (
    <section className="py-20 px-4 bg-gray-900/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Homeowners <span className="gradient-text">Sell FSBO</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="w-12 h-12 bg-aire-500/20 rounded-xl flex items-center justify-center mb-4">
              <i className="fas fa-piggy-bank text-aire-400 text-xl" />
            </div>
            <h3 className="font-bold text-lg mb-2">Keep Your Equity</h3>
            <p className="text-gray-400 text-sm">
              On a $750K home, a 6% agent commission is $45,000. With AIREA starting
              at $299, you keep the difference.
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="w-12 h-12 bg-aire-500/20 rounded-xl flex items-center justify-center mb-4">
              <i className="fas fa-user-check text-aire-400 text-xl" />
            </div>
            <h3 className="font-bold text-lg mb-2">You're in Control</h3>
            <p className="text-gray-400 text-sm">
              Set your own price, manage your own showings, and negotiate directly
              with buyers. AIREA gives you the tools to do it confidently.
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="w-12 h-12 bg-aire-500/20 rounded-xl flex items-center justify-center mb-4">
              <i className="fas fa-bolt text-aire-400 text-xl" />
            </div>
            <h3 className="font-bold text-lg mb-2">AI Does the Heavy Lifting</h3>
            <p className="text-gray-400 text-sm">
              AI writes your listing, estimates your home value, and helps you
              compare offers — so you can focus on what matters.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
