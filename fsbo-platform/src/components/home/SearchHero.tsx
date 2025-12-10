'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Home } from 'lucide-react'

const WA_CITIES = [
  'Seattle',
  'Spokane',
  'Tacoma',
  'Vancouver',
  'Bellevue',
  'Kent',
  'Everett',
  'Renton',
  'Spokane Valley',
  'Federal Way',
  'Yakima',
  'Kirkland',
  'Bellingham',
  'Kennewick',
  'Auburn',
  'Pasco',
  'Marysville',
  'Lakewood',
  'Redmond',
  'Shoreline',
]

export default function SearchHero() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [propertyType, setPropertyType] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (propertyType) params.set('type', propertyType)

    router.push(`/search?${params.toString()}`)
  }

  return (
    <div>
      {/* Search Form */}
      <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-xl p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Location Search */}
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="City or ZIP code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900"
              list="cities"
            />
            <datalist id="cities">
              {WA_CITIES.map((city) => (
                <option key={city} value={city} />
              ))}
            </datalist>
          </div>

          {/* Property Type */}
          <div className="md:w-64 relative">
            <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 bg-white"
            >
              <option value="">All Property Types</option>
              <option value="single_family">Single Family</option>
              <option value="condo">Condo</option>
              <option value="townhouse">Townhouse</option>
              <option value="multi_family">Multi-Family</option>
              <option value="land">Land</option>
              <option value="manufactured">Manufactured</option>
            </select>
          </div>

          {/* Search Button */}
          <button type="submit" className="btn-primary flex items-center justify-center gap-2 px-8 whitespace-nowrap">
            <Search className="w-5 h-5" />
            Search Homes
          </button>
        </div>
      </form>

      {/* Popular Cities */}
      <div className="flex flex-wrap justify-center gap-2">
        {WA_CITIES.slice(0, 8).map((city) => (
          <button
            key={city}
            onClick={() => router.push(`/search?q=${city}`)}
            className="px-3 py-1 text-sm bg-white/20 hover:bg-white/30 border border-white/30 rounded-full text-white transition-colors"
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  )
}
