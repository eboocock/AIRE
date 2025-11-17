import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { PlusCircle, Eye, Heart, MessageSquare, TrendingUp } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Get user's listings
  const { data: listings, count: listingsCount } = await supabase
    .from('listings')
    .select('*', { count: 'exact' })
    .eq('user_id', session?.user.id || '')
    .order('created_at', { ascending: false })

  // Calculate total views and favorites
  const listingsData = (listings || []) as any[]
  const totalViews = listingsData.reduce((sum, listing) => sum + (listing.views || 0), 0)
  const totalFavorites = listingsData.reduce((sum, listing) => sum + (listing.favorites || 0), 0)
  const totalInquiries = listingsData.reduce((sum, listing) => sum + (listing.inquiries || 0), 0)

  const activeListings = listingsData.filter((l) => l.status === 'active').length

  return (
    <div className="lg:pl-64">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back!</h1>
          <p className="text-slate-600">Here's an overview of your FSBO listings</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            label="Active Listings"
            value={activeListings}
            bgColor="bg-primary-100"
            iconColor="text-primary-600"
          />
          <StatCard
            icon={<Eye className="w-6 h-6" />}
            label="Total Views"
            value={totalViews}
            bgColor="bg-secondary-100"
            iconColor="text-secondary-600"
          />
          <StatCard
            icon={<Heart className="w-6 h-6" />}
            label="Favorites"
            value={totalFavorites}
            bgColor="bg-accent-100"
            iconColor="text-accent-600"
          />
          <StatCard
            icon={<MessageSquare className="w-6 h-6" />}
            label="Inquiries"
            value={totalInquiries}
            bgColor="bg-green-100"
            iconColor="text-green-600"
          />
        </div>

        {/* Quick Actions */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/dashboard/listings/new"
              className="flex items-center gap-3 p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all group"
            >
              <div className="w-12 h-12 bg-primary-100 group-hover:bg-primary-200 rounded-lg flex items-center justify-center transition-colors">
                <PlusCircle className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Create New Listing</p>
                <p className="text-sm text-slate-600">List your property for free</p>
              </div>
            </Link>

            <Link
              href="/dashboard/listings"
              className="flex items-center gap-3 p-4 border border-slate-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all"
            >
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-slate-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">View All Listings</p>
                <p className="text-sm text-slate-600">Manage your properties</p>
              </div>
            </Link>

            <Link
              href="/dashboard/messages"
              className="flex items-center gap-3 p-4 border border-slate-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all"
            >
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-slate-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Check Messages</p>
                <p className="text-sm text-slate-600">View buyer inquiries</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Listings */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Recent Listings</h2>
            <Link href="/dashboard/listings" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
              View all →
            </Link>
          </div>

          {listingsData.length > 0 ? (
            <div className="space-y-4">
              {listingsData.slice(0, 5).map((listing) => (
                <div
                  key={listing.id}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{listing.address_line1}</h3>
                    <p className="text-sm text-slate-600">
                      {listing.city}, {listing.state} {listing.zip_code}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm text-slate-500">
                        <Eye className="w-4 h-4 inline mr-1" />
                        {listing.views} views
                      </span>
                      <span className="text-sm text-slate-500">
                        <Heart className="w-4 h-4 inline mr-1" />
                        {listing.favorites} favorites
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary-600">
                      ${listing.price.toLocaleString()}
                    </p>
                    <span
                      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mt-2 ${
                        listing.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : listing.status === 'draft'
                          ? 'bg-slate-100 text-slate-800'
                          : listing.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {listing.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PlusCircle className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No listings yet</h3>
              <p className="text-slate-600 mb-6">Create your first listing to get started</p>
              <Link href="/dashboard/listings/new" className="btn-primary inline-block">
                Create Listing
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  bgColor,
  iconColor,
}: {
  icon: React.ReactNode
  label: string
  value: number
  bgColor: string
  iconColor: string
}) {
  return (
    <div className="card">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center ${iconColor}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-slate-600">{label}</p>
          <p className="text-2xl font-bold text-slate-900">{value.toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}
