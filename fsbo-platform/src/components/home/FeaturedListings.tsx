import Link from 'next/link'
import { MapPin, Bed, Bath, Maximize, ArrowRight } from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'

interface Listing {
  id: string
  slug: string
  address_line1: string
  city: string
  state: string
  zip_code: string
  price: number
  bedrooms: number
  bathrooms: number
  sqft?: number
  property_type: string
  photos: string[]
  published_at: string
}

export default function FeaturedListings({ listings }: { listings: Listing[] }) {
  if (!listings || listings.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">Featured Listings</h3>
            <p className="text-slate-600 mb-8">Browse the newest homes for sale by owner in Washington</p>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-12">
              <p className="text-slate-600">No listings available at this time. Check back soon!</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-slate-900 mb-4">Featured Listings</h3>
          <p className="text-slate-600">Browse the newest homes for sale by owner in Washington</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>

        <div className="text-center">
          <Link href="/search" className="btn-primary inline-flex items-center gap-2">
            View All Listings
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

function ListingCard({ listing }: { listing: Listing }) {
  const photoUrl = listing.photos && listing.photos.length > 0
    ? listing.photos[0]
    : '/placeholder-home.jpg'

  return (
    <Link href={`/listing/${listing.slug}`} className="card-hover group">
      {/* Photo */}
      <div className="relative h-48 bg-slate-200 rounded-t-lg overflow-hidden mb-4">
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-300 to-slate-400">
          <span className="text-slate-500 text-sm">Photo Coming Soon</span>
        </div>
        <div className="absolute top-3 right-3 bg-primary-500 text-white px-3 py-1 rounded-lg text-sm font-bold shadow-lg">
          {formatPrice(listing.price)}
        </div>
      </div>

      {/* Details */}
      <div className="px-4 pb-4">
        <h4 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">
          {listing.address_line1}
        </h4>
        <div className="flex items-center gap-1 text-sm text-slate-600 mb-3">
          <MapPin className="w-4 h-4" />
          <span>{listing.city}, {listing.state} {listing.zip_code}</span>
        </div>

        {/* Property Stats */}
        <div className="flex items-center gap-4 text-sm text-slate-700 pb-3 mb-3 border-b border-slate-200">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4 text-slate-500" />
            <span>{listing.bedrooms} bed</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4 text-slate-500" />
            <span>{listing.bathrooms} bath</span>
          </div>
          {listing.sqft && (
            <div className="flex items-center gap-1">
              <Maximize className="w-4 h-4 text-slate-500" />
              <span>{listing.sqft.toLocaleString()} sqft</span>
            </div>
          )}
        </div>

        {/* Property Type & Date */}
        <div className="flex items-center justify-between text-xs">
          <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded capitalize">
            {listing.property_type.replace('_', ' ')}
          </span>
          <span className="text-slate-500">
            Listed {formatDate(listing.published_at)}
          </span>
        </div>
      </div>
    </Link>
  )
}
