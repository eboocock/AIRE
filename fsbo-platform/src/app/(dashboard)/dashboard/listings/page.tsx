import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { PlusCircle, Eye, Edit, Trash2, MoreVertical, Search } from 'lucide-react'
import { formatPrice, calculateDaysOnMarket } from '@/lib/utils'
import ListingActions from '@/components/listing/ListingActions'

export default async function ListingsPage() {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Get user's listings
  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .eq('user_id', session?.user.id || '')
    .order('created_at', { ascending: false })

  const listingsData = (listings || []) as any[]

  const statusCounts = {
    all: listingsData.length,
    active: listingsData.filter((l) => l.status === 'active').length,
    draft: listingsData.filter((l) => l.status === 'draft').length,
    pending: listingsData.filter((l) => l.status === 'pending').length,
    sold: listingsData.filter((l) => l.status === 'sold').length,
  }

  return (
    <div className="lg:pl-64">
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">My Listings</h1>
            <p className="text-slate-600">Manage your property listings</p>
          </div>
          <Link href="/dashboard/listings/new" className="btn-primary flex items-center gap-2">
            <PlusCircle className="w-5 h-5" />
            Create Listing
          </Link>
        </div>

        {/* Status Tabs */}
        <div className="card mb-6">
          <div className="flex items-center gap-6 overflow-x-auto">
            <StatusTab label="All" count={statusCounts.all} active />
            <StatusTab label="Active" count={statusCounts.active} />
            <StatusTab label="Draft" count={statusCounts.draft} />
            <StatusTab label="Pending" count={statusCounts.pending} />
            <StatusTab label="Sold" count={statusCounts.sold} />
          </div>
        </div>

        {/* Listings Grid/Table */}
        {listingsData.length > 0 ? (
          <div className="space-y-4">
            {listingsData.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  )
}

function StatusTab({ label, count, active = false }: { label: string; count: number; active?: boolean }) {
  return (
    <button
      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors whitespace-nowrap ${
        active
          ? 'bg-primary-500 text-white'
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
      }`}
    >
      {label} ({count})
    </button>
  )
}

function ListingCard({ listing }: { listing: any }) {
  const statusColors = {
    active: 'bg-green-100 text-green-800 border-green-200',
    draft: 'bg-slate-100 text-slate-800 border-slate-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    sold: 'bg-blue-100 text-blue-800 border-blue-200',
    expired: 'bg-red-100 text-red-800 border-red-200',
  }

  const daysOnMarket = listing.published_at ? calculateDaysOnMarket(listing.published_at) : null

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-6">
        {/* Photo Preview */}
        <div className="w-48 h-32 bg-slate-200 rounded-lg flex-shrink-0 overflow-hidden">
          {listing.photos && listing.photos.length > 0 ? (
            <img
              src={listing.photos[0].url}
              alt={listing.address_line1}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 bg-slate-300 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-slate-500" />
                </div>
                <p className="text-xs text-slate-500">No photo</p>
              </div>
            </div>
          )}
        </div>

        {/* Listing Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-slate-900 mb-1 truncate">
                {listing.address_line1}
              </h3>
              <p className="text-slate-600 text-sm">
                {listing.city}, {listing.state} {listing.zip_code}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-2xl font-bold text-primary-600">
                {formatPrice(listing.price)}
              </div>
              <span
                className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border mt-2 ${
                  statusColors[listing.status as keyof typeof statusColors]
                }`}
              >
                {listing.status}
              </span>
            </div>
          </div>

          {/* Property Details */}
          <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
            <span>{listing.bedrooms} bed</span>
            <span>•</span>
            <span>{listing.bathrooms} bath</span>
            {listing.sqft && (
              <>
                <span>•</span>
                <span>{listing.sqft.toLocaleString()} sqft</span>
              </>
            )}
            {listing.property_type && (
              <>
                <span>•</span>
                <span className="capitalize">{listing.property_type.replace('_', ' ')}</span>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-slate-400" />
              <span className="text-slate-600">{listing.views || 0} views</span>
            </div>
            {daysOnMarket !== null && (
              <div className="text-slate-600">
                {daysOnMarket === 0 ? 'Listed today' : `${daysOnMarket} days on market`}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0">
          <ListingActions listingId={listing.id} status={listing.status} />
        </div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="card text-center py-16">
      <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <PlusCircle className="w-10 h-10 text-primary-600" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">No listings yet</h2>
      <p className="text-slate-600 mb-6 max-w-md mx-auto">
        Create your first listing to start selling your property. It only takes a few minutes!
      </p>
      <Link href="/dashboard/listings/new" className="btn-primary inline-flex items-center gap-2">
        <PlusCircle className="w-5 h-5" />
        Create Your First Listing
      </Link>
    </div>
  )
}
