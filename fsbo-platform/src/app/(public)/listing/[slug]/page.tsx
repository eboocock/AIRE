import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { formatPrice, formatDate, calculateDaysOnMarket } from '@/lib/utils'
import {
  Home,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Car,
  Calendar,
  Eye,
  Heart,
  Share2,
  MessageSquare,
  ArrowLeft,
} from 'lucide-react'
import ContactSellerForm from '@/components/listing/ContactSellerForm'
import PhotoGallery from '@/components/listing/PhotoGallery'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = await createClient()

  const { data: listing } = await (supabase
    .from('listings') as any)
    .select('*')
    .eq('slug', params.slug)
    .eq('status', 'active')
    .single()

  if (!listing) {
    return {
      title: 'Listing Not Found - AIRE FSBO',
    }
  }

  return {
    title: listing.meta_title || `${listing.address_line1}, ${listing.city}, WA - AIRE FSBO`,
    description:
      listing.meta_description ||
      listing.description?.substring(0, 155) ||
      `${listing.bedrooms} bed, ${listing.bathrooms} bath home for sale in ${listing.city}, WA`,
    openGraph: {
      title: listing.meta_title || `${listing.address_line1}, ${listing.city}, WA`,
      description: listing.description?.substring(0, 200) || '',
      images: listing.photos && listing.photos.length > 0 ? [listing.photos[0].url] : [],
    },
  }
}

export default async function PublicListingPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient()

  const { data: listing } = await (supabase
    .from('listings') as any)
    .select('*, users(full_name, email, phone)')
    .eq('slug', params.slug)
    .eq('status', 'active')
    .single()

  if (!listing) {
    notFound()
  }

  // Increment view count
  await (supabase
    .from('listings') as any)
    .update({ views: (listing.views || 0) + 1 })
    .eq('id', listing.id)

  const daysOnMarket = listing.published_at ? calculateDaysOnMarket(listing.published_at) : 0

  const propertyTypeLabels: Record<string, string> = {
    single_family: 'Single Family Home',
    condo: 'Condominium',
    townhouse: 'Townhouse',
    multi_family: 'Multi-Family',
    land: 'Land',
    mobile: 'Mobile/Manufactured Home',
    other: 'Other',
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="container py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">AIRE</h1>
              <p className="text-xs text-slate-600">FSBO Platform</p>
            </div>
          </Link>
          <div className="flex gap-4">
            <Link href="/" className="text-slate-600 hover:text-slate-900 font-medium">
              Search Listings
            </Link>
            <Link href="/login" className="btn-outline">
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Photo Gallery */}
      <PhotoGallery photos={listing.photos || []} address={listing.address_line1} />

      {/* Main Content */}
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Listing Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">{listing.address_line1}</h1>
                  <p className="text-lg text-slate-600 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    {listing.city}, {listing.state} {listing.zip_code}
                    {listing.county && ` • ${listing.county}`}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-primary-600">{formatPrice(listing.price)}</div>
                  {listing.hoa_fee && (
                    <p className="text-sm text-slate-600 mt-1">+ {formatPrice(listing.hoa_fee)}/mo HOA</p>
                  )}
                </div>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <StatCard icon={<Bed className="w-5 h-5" />} value={listing.bedrooms} label="Bedrooms" />
                <StatCard icon={<Bath className="w-5 h-5" />} value={listing.bathrooms} label="Bathrooms" />
                {listing.sqft && (
                  <StatCard
                    icon={<Maximize className="w-5 h-5" />}
                    value={listing.sqft.toLocaleString()}
                    label="Sq Ft"
                  />
                )}
                {listing.parking_spaces && (
                  <StatCard icon={<Car className="w-5 h-5" />} value={listing.parking_spaces} label="Parking" />
                )}
              </div>

              {/* Additional Info Bar */}
              <div className="flex items-center gap-6 mt-6 pt-6 border-t border-slate-200 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  <span>{propertyTypeLabels[listing.property_type]}</span>
                </div>
                {listing.year_built && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Built {listing.year_built}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{listing.views || 0} views</span>
                </div>
                {daysOnMarket > 0 && (
                  <div className="text-slate-600">
                    <span>{daysOnMarket} days on market</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {listing.description && (
              <div className="card">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">About This Property</h2>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{listing.description}</p>
              </div>
            )}

            {/* Features */}
            {listing.features && listing.features.length > 0 && (
              <div className="card">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Features</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {listing.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      <span className="text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Property Details */}
            <div className="card">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Property Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <DetailRow label="Property Type" value={propertyTypeLabels[listing.property_type]} />
                <DetailRow label="Bedrooms" value={listing.bedrooms} />
                <DetailRow label="Bathrooms" value={listing.bathrooms} />
                {listing.sqft && <DetailRow label="Square Footage" value={`${listing.sqft.toLocaleString()} sqft`} />}
                {listing.lot_size && <DetailRow label="Lot Size" value={`${listing.lot_size} acres`} />}
                {listing.year_built && <DetailRow label="Year Built" value={listing.year_built} />}
                {listing.parking_spaces && <DetailRow label="Parking Spaces" value={listing.parking_spaces} />}
                {listing.garage_spaces && <DetailRow label="Garage Spaces" value={listing.garage_spaces} />}
                {listing.hoa_fee && <DetailRow label="HOA Fee" value={`${formatPrice(listing.hoa_fee)}/mo`} />}
                {listing.property_tax && (
                  <DetailRow label="Property Tax" value={`${formatPrice(listing.property_tax)}/yr`} />
                )}
              </div>

              {/* Amenities */}
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-3">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {listing.has_ac && <AmenityBadge label="Air Conditioning" emoji="❄️" />}
                  {listing.has_heating && <AmenityBadge label="Heating" emoji="🔥" />}
                  {listing.has_fireplace && <AmenityBadge label="Fireplace" emoji="🔥" />}
                  {listing.has_pool && <AmenityBadge label="Pool" emoji="🏊" />}
                  {listing.has_basement && <AmenityBadge label="Basement" emoji="🏠" />}
                </div>
              </div>
            </div>

            {/* Video Tour / Virtual Tour */}
            {(listing.video_url || listing.virtual_tour_url) && (
              <div className="card">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Virtual Tour</h2>
                <div className="space-y-4">
                  {listing.video_url && (
                    <div>
                      <h3 className="font-semibold text-slate-700 mb-2">Video Tour</h3>
                      <a
                        href={listing.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 underline"
                      >
                        Watch Video Tour →
                      </a>
                    </div>
                  )}
                  {listing.virtual_tour_url && (
                    <div>
                      <h3 className="font-semibold text-slate-700 mb-2">3D Virtual Tour</h3>
                      <a
                        href={listing.virtual_tour_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 underline"
                      >
                        View 3D Tour →
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <ContactSellerForm listingId={listing.id} sellerId={listing.user_id} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 mt-16">
        <div className="container text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <span className="text-white font-bold text-lg">AIRE FSBO</span>
          </div>
          <p className="text-sm">&copy; 2025 AIRE FSBO Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: number | string; label: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
        {icon}
      </div>
      <div>
        <div className="text-lg font-bold text-slate-900">{value}</div>
        <div className="text-xs text-slate-600">{label}</div>
      </div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between py-2 border-b border-slate-100">
      <span className="text-slate-600">{label}:</span>
      <span className="font-semibold text-slate-900">{value}</span>
    </div>
  )
}

function AmenityBadge({ label, emoji }: { label: string; emoji: string }) {
  return (
    <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
      {emoji} {label}
    </span>
  )
}
