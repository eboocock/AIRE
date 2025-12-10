import Link from 'next/link'
import { MapPin, Bed, Bath, Maximize, Heart } from 'lucide-react'
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
  description?: string
}

export default function SearchResults({ listings }: { listings: Listing[] }) {
  if (!listings || listings.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="w-16 h-16 bg-slate-200 rounded-full mx-auto mb-4 flex items-center justify-center">
          <MapPin className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">No listings found</h3>
        <p className="text-slate-600 mb-6">
          Try adjusting your filters or search in a different area
        </p>
        <Link href="/search" className="btn-primary inline-block">
          Clear Filters
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  )
}

function ListingCard({ listing }: { listing: Listing }) {
  const photoUrl = listing.photos && listing.photos.length > 0
    ? listing.photos[0]
    : '/placeholder-home.jpg'

  return (
    <Link href={`/listing/${listing.slug}`} className="card-hover group flex flex-col md:flex-row gap-4">
      {/* Photo */}
      <div className="md:w-64 md:h-48 h-48 flex-shrink-0">
        <div className="relative w-full h-full bg-slate-200 rounded-lg overflow-hidden">
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-300 to-slate-400">
            <span className="text-slate-500 text-sm">Photo Coming Soon</span>
          </div>
          <div className="absolute top-3 left-3 bg-primary-500 text-white px-3 py-1 rounded-lg text-sm font-bold shadow-lg">
            {formatPrice(listing.price)}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault()
              // TODO: Implement favorites functionality
            }}
            className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-50 transition-colors"
          >
            <Heart className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-primary-600 transition-colors">
              {listing.address_line1}
            </h3>
            <div className="flex items-center gap-1 text-sm text-slate-600 mb-3">
              <MapPin className="w-4 h-4" />
              <span>{listing.city}, {listing.state} {listing.zip_code}</span>
            </div>
          </div>
        </div>

        {/* Property Stats */}
        <div className="flex items-center gap-6 text-sm text-slate-700 mb-3">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4 text-slate-500" />
            <span className="font-semibold">{listing.bedrooms}</span>
            <span className="text-slate-600">bed</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4 text-slate-500" />
            <span className="font-semibold">{listing.bathrooms}</span>
            <span className="text-slate-600">bath</span>
          </div>
          {listing.sqft && (
            <div className="flex items-center gap-1">
              <Maximize className="w-4 h-4 text-slate-500" />
              <span className="font-semibold">{listing.sqft.toLocaleString()}</span>
              <span className="text-slate-600">sqft</span>
            </div>
          )}
        </div>

        {/* Description Preview */}
        {listing.description && (
          <p className="text-sm text-slate-600 mb-3 line-clamp-2">
            {listing.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200">
          <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded capitalize">
            {listing.property_type.replace('_', ' ')}
          </span>
          <span className="text-xs text-slate-500">
            Listed {formatDate(listing.published_at)}
          </span>
        </div>
      </div>
    </Link>
  )
}
