import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import SearchResults from '@/components/search/SearchResults'
import SearchFilters from '@/components/search/SearchFilters'
import { MapPin, Home } from 'lucide-react'

export const metadata = {
  title: 'Search Homes for Sale by Owner in Washington | AIRE',
  description: 'Find your dream home in Washington. Browse FSBO listings without realtor commissions. Filter by city, price, bedrooms, and more.',
}

interface SearchParams {
  searchParams: Promise<{
    q?: string
    type?: string
    minPrice?: string
    maxPrice?: string
    beds?: string
    baths?: string
    city?: string
  }>
}

export default async function SearchPage({ searchParams }: SearchParams) {
  const params = await searchParams
  const supabase = await createClient()

  // Build query
  let query = (supabase.from('listings') as any).select('*').eq('status', 'active')

  // Apply filters
  if (params.q) {
    // Search in city or zip code
    query = query.or(`city.ilike.%${params.q}%,zip_code.ilike.%${params.q}%`)
  }

  if (params.city) {
    query = query.ilike('city', `%${params.city}%`)
  }

  if (params.type) {
    query = query.eq('property_type', params.type)
  }

  if (params.minPrice) {
    query = query.gte('price', parseInt(params.minPrice))
  }

  if (params.maxPrice) {
    query = query.lte('price', parseInt(params.maxPrice))
  }

  if (params.beds) {
    query = query.gte('bedrooms', parseInt(params.beds))
  }

  if (params.baths) {
    query = query.gte('bathrooms', parseInt(params.baths))
  }

  // Order by most recent
  query = query.order('published_at', { ascending: false })

  const { data: listings, error } = await query

  if (error) {
    console.error('Error fetching listings:', error)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container py-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Search Homes for Sale</h1>
          <p className="text-slate-600">
            {listings?.length || 0} {listings?.length === 1 ? 'home' : 'homes'} for sale by owner in Washington
          </p>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Suspense fallback={<div>Loading filters...</div>}>
              <SearchFilters searchParams={params} />
            </Suspense>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            <Suspense fallback={<div>Loading results...</div>}>
              <SearchResults listings={listings || []} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
