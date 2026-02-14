import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-gray-800 py-12 px-4 bg-gray-950">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-aire-400 to-aire-600 rounded-xl flex items-center justify-center">
                <i className="fas fa-robot text-white text-lg" />
              </div>
              <span className="text-2xl font-bold">AIRE</span>
            </Link>
            <p className="text-gray-500 text-sm">
              Your AI-powered real estate agent. Sell your home for a flat $499
              fee and keep your equity.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/#how-it-works" className="hover:text-white transition">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#features" className="hover:text-white transition">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/ai-valuation" className="hover:text-white transition">
                  Free AI Valuation
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white transition">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/press" className="hover:text-white transition">
                  Press
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/licenses" className="hover:text-white transition">
                  Licenses
                </Link>
              </li>
              <li>
                <Link href="/fair-housing" className="hover:text-white transition">
                  Fair Housing
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} AIRE Technologies Inc. All rights
            reserved.
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="https://twitter.com/airetech"
              className="text-gray-500 hover:text-white transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-twitter text-lg" />
            </a>
            <a
              href="https://linkedin.com/company/aire"
              className="text-gray-500 hover:text-white transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-linkedin text-lg" />
            </a>
            <a
              href="https://instagram.com/airetech"
              className="text-gray-500 hover:text-white transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-instagram text-lg" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
