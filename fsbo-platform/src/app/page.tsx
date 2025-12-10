import Link from 'next/link'
import { ArrowRight, Home, FileText, BadgeDollarSign, CheckCircle, Search, MapPin } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import SearchHero from '@/components/home/SearchHero'
import FeaturedListings from '@/components/home/FeaturedListings'

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch featured listings (most recent active listings)
  const { data: featuredListings } = await (supabase
    .from('listings') as any)
    .select('*')
    .eq('status', 'active')
    .order('published_at', { ascending: false })
    .limit(6)

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200">
        <div className="container py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">AIRE</h1>
              <p className="text-xs text-slate-600">FSBO Platform</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Link href="/login" className="text-slate-600 hover:text-slate-900 font-medium">
              Sign In
            </Link>
            <Link href="/register" className="btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with Search */}
      <section className="bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 text-white py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-5xl font-bold mb-6">
                Find Your Dream Home in Washington
              </h2>
              <p className="text-xl mb-8 text-primary-50">
                Browse homes for sale by owner. No realtor commissions. Better prices. Direct communication.
              </p>
            </div>

            {/* Search Form */}
            <SearchHero />

            <p className="mt-6 text-sm text-primary-100 text-center">
              ✓ Direct from owners  ✓ No middleman fees  ✓ Thousands in savings
            </p>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <FeaturedListings listings={featuredListings || []} />

      {/* Seller CTA Section */}
      <section className="py-16 bg-primary-50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">
              Want to Sell Your Home?
            </h3>
            <p className="text-xl text-slate-600 mb-6">
              List for free. Pay only when you're ready to accept offers and close.
              Save thousands in commission fees with AIRE's complete FSBO platform.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/register" className="btn-primary inline-flex items-center gap-2">
                Start Listing for Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="#how-it-works" className="btn-outline">
                Learn More
              </Link>
            </div>
            <p className="mt-4 text-sm text-slate-500">
              ✓ No credit card required  ✓ List in minutes  ✓ Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">$0</div>
              <div className="text-slate-600">To List Your Home</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">$499</div>
              <div className="text-slate-600">When Ready to Close</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">$25K+</div>
              <div className="text-slate-600">Average Savings</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="container">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-slate-900 mb-4">
              Complete FSBO Solution
            </h3>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Everything you need to sell your home, from listing to closing, all in one platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="card-hover text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-primary-600" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">
                1. List for Free
              </h4>
              <p className="text-slate-600">
                Create your listing with our guided wizard. Add photos, details, and publish in minutes. No fees.
              </p>
              <div className="mt-4 text-sm text-green-600 font-semibold">
                ✓ FREE Forever
              </div>
            </div>

            {/* Step 2 */}
            <div className="card-hover text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-primary-600" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">
                2. Get Offers
              </h4>
              <p className="text-slate-600">
                Buyers find your listing and submit offers through our platform. View and compare all offers.
              </p>
              <div className="mt-4 text-sm text-green-600 font-semibold">
                ✓ FREE to View
              </div>
            </div>

            {/* Step 3 */}
            <div className="card-hover text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BadgeDollarSign className="w-8 h-8 text-accent-600" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">
                3. Unlock Transaction
              </h4>
              <p className="text-slate-600">
                Ready to accept an offer? Unlock full transaction tools, legal documents, and e-signatures.
              </p>
              <div className="mt-4 text-sm text-accent-600 font-semibold">
                $499 One-Time Fee
              </div>
            </div>

            {/* Step 4 */}
            <div className="card-hover text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-secondary-600" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">
                4. Close the Deal
              </h4>
              <p className="text-slate-600">
                Manage documents, coordinate with title company, and close your sale with our step-by-step checklist.
              </p>
              <div className="mt-4 text-sm text-secondary-600 font-semibold">
                ✓ Included in Package
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-slate-900 mb-4">
              Everything You Need to Sell
            </h3>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Professional tools and Washington State legal documents at a fraction of realtor commission
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              title="Guided Listing Wizard"
              description="Step-by-step process to create professional listings in minutes"
              free={true}
            />
            <FeatureCard
              title="Professional Photos"
              description="Upload up to 30 high-quality photos with drag-and-drop interface"
              free={true}
            />
            <FeatureCard
              title="SEO-Optimized Pages"
              description="Get found on Google with optimized listing pages"
              free={true}
            />
            <FeatureCard
              title="Offer Management"
              description="Compare multiple offers side-by-side and negotiate terms"
              free={false}
            />
            <FeatureCard
              title="Legal Documents"
              description="WA-specific purchase agreements, disclosures, and addendums"
              free={false}
            />
            <FeatureCard
              title="E-Signatures"
              description="DocuSign integration for secure electronic document signing"
              free={false}
            />
            <FeatureCard
              title="Buyer Messaging"
              description="Secure communication with potential buyers"
              free={false}
            />
            <FeatureCard
              title="Transaction Dashboard"
              description="Track your sale from offer to closing with visual timeline"
              free={false}
            />
            <FeatureCard
              title="Closing Checklist"
              description="Never miss a step with our comprehensive closing coordination"
              free={false}
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-slate-50">
        <div className="container">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-slate-900 mb-4">
              Simple, Transparent Pricing
            </h3>
            <p className="text-xl text-slate-600">
              No hidden fees. No monthly subscriptions. Pay only when you need it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className="card-hover border-2 border-primary-200">
              <div className="text-center mb-6">
                <h4 className="text-2xl font-bold text-slate-900 mb-2">Free Forever</h4>
                <div className="text-5xl font-bold text-primary-600 mb-4">$0</div>
                <p className="text-slate-600">Perfect for listing and marketing your home</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Unlimited listings</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Professional listing pages</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Up to 30 photos per listing</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Analytics dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Showing scheduler</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>View buyer inquiries</span>
                </li>
              </ul>
              <Link href="/register" className="btn-outline w-full text-center">
                Start Listing Free
              </Link>
            </div>

            {/* Paid Tier */}
            <div className="card-hover border-2 border-accent-500 bg-gradient-to-br from-accent-50 to-white relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-accent-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Best Value
              </div>
              <div className="text-center mb-6">
                <h4 className="text-2xl font-bold text-slate-900 mb-2">Close It Package</h4>
                <div className="text-5xl font-bold text-accent-600 mb-4">$499</div>
                <p className="text-slate-600">One-time fee when ready to accept offers</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="font-semibold">Everything in Free, plus:</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Full offer management system</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>WA legal document templates</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>E-signature integration (DocuSign)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Buyer-seller messaging</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Transaction coordination dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Closing checklist & timeline</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Priority customer support</span>
                </li>
              </ul>
              <div className="bg-white rounded-lg p-4 mb-6 border border-accent-200">
                <p className="text-sm text-slate-600 text-center">
                  <span className="font-bold text-accent-600">Save $24,500+</span> on a $500K home compared to 5% realtor commission
                </p>
              </div>
              <Link href="/register" className="btn-primary w-full text-center">
                Start Free, Upgrade When Ready
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
        <div className="container text-center">
          <h3 className="text-4xl font-bold mb-6">
            Ready to Sell Your Home?
          </h3>
          <p className="text-xl mb-8 text-primary-50 max-w-2xl mx-auto">
            Join hundreds of Washington homeowners who have successfully sold their homes without a realtor using AIRE
          </p>
          <Link href="/register" className="bg-white text-primary-600 hover:bg-primary-50 font-bold py-4 px-8 rounded-lg transition-colors inline-flex items-center gap-2 text-lg">
            Create Your Free Listing
            <ArrowRight className="w-6 h-6" />
          </Link>
          <p className="mt-6 text-sm text-primary-100">
            No credit card required • List in 10 minutes • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">A</span>
                </div>
                <span className="text-white font-bold text-lg">AIRE</span>
              </div>
              <p className="text-sm">
                Washington State's premier FSBO platform. Sell your home without a realtor.
              </p>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Platform</h5>
              <ul className="space-y-2 text-sm">
                <li><Link href="/how-it-works" className="hover:text-white">How It Works</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/features" className="hover:text-white">Features</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Resources</h5>
              <ul className="space-y-2 text-sm">
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="/legal" className="hover:text-white">Legal Resources</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Company</h5>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-sm text-center">
            <p>&copy; 2025 AIRE FSBO Platform. All rights reserved. Licensed in Washington State.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ title, description, free }: { title: string; description: string; free: boolean }) {
  return (
    <div className="card">
      <div className="flex items-start justify-between mb-3">
        <h5 className="text-lg font-semibold text-slate-900">{title}</h5>
        {free ? (
          <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">FREE</span>
        ) : (
          <span className="text-xs font-semibold text-accent-600 bg-accent-50 px-2 py-1 rounded">PAID</span>
        )}
      </div>
      <p className="text-slate-600 text-sm">{description}</p>
    </div>
  )
}
