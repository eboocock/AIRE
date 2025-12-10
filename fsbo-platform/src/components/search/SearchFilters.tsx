'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'

interface SearchFiltersProps {
  searchParams: {
    q?: string
    type?: string
    minPrice?: string
    maxPrice?: string
    beds?: string
    baths?: string
    city?: string
  }
}

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

export default function SearchFilters({ searchParams }: SearchFiltersProps) {
  const router = useRouter()
  const params = useSearchParams()

  const [filters, setFilters] = useState({
    q: searchParams.q || '',
    type: searchParams.type || '',
    minPrice: searchParams.minPrice || '',
    maxPrice: searchParams.maxPrice || '',
    beds: searchParams.beds || '',
    baths: searchParams.baths || '',
  })

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    const newParams = new URLSearchParams()

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value)
      }
    })

    router.push(`/search?${newParams.toString()}`)
  }

  const clearFilters = () => {
    setFilters({
      q: '',
      type: '',
      minPrice: '',
      maxPrice: '',
      beds: '',
      baths: '',
    })
    router.push('/search')
  }

  const hasActiveFilters = Object.values(filters).some((v) => v !== '')

  return (
    <div className="card sticky top-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5" />
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Location
          </label>
          <input
            type="text"
            placeholder="City or ZIP..."
            value={filters.q}
            onChange={(e) => handleFilterChange('q', e.target.value)}
            className="input"
            list="cities-filter"
          />
          <datalist id="cities-filter">
            {WA_CITIES.map((city) => (
              <option key={city} value={city} />
            ))}
          </datalist>
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Property Type
          </label>
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="input"
          >
            <option value="">All Types</option>
            <option value="single_family">Single Family</option>
            <option value="condo">Condo</option>
            <option value="townhouse">Townhouse</option>
            <option value="multi_family">Multi-Family</option>
            <option value="land">Land</option>
            <option value="manufactured">Manufactured</option>
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Price Range
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              className="input"
              min="0"
              step="10000"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className="input"
              min="0"
              step="10000"
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {[
              { label: 'Under 300K', max: '300000' },
              { label: '300K-500K', min: '300000', max: '500000' },
              { label: '500K-750K', min: '500000', max: '750000' },
              { label: '750K+', min: '750000' },
            ].map((range) => (
              <button
                key={range.label}
                onClick={() => {
                  handleFilterChange('minPrice', range.min || '')
                  handleFilterChange('maxPrice', range.max || '')
                }}
                className="text-xs px-2 py-1 border border-slate-300 rounded hover:bg-slate-50 transition-colors"
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bedrooms */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Bedrooms
          </label>
          <div className="grid grid-cols-5 gap-2">
            {['', '1', '2', '3', '4', '5+'].map((num) => (
              <button
                key={num || 'any'}
                onClick={() => handleFilterChange('beds', num === '5+' ? '5' : num)}
                className={`px-2 py-2 text-sm rounded-lg border-2 transition-colors ${
                  filters.beds === (num === '5+' ? '5' : num)
                    ? 'border-primary-500 bg-primary-50 text-primary-700 font-semibold'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {num || 'Any'}
              </button>
            ))}
          </div>
        </div>

        {/* Bathrooms */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Bathrooms
          </label>
          <div className="grid grid-cols-5 gap-2">
            {['', '1', '2', '3', '4+'].map((num) => (
              <button
                key={num || 'any'}
                onClick={() => handleFilterChange('baths', num === '4+' ? '4' : num)}
                className={`px-2 py-2 text-sm rounded-lg border-2 transition-colors ${
                  filters.baths === (num === '4+' ? '4' : num)
                    ? 'border-primary-500 bg-primary-50 text-primary-700 font-semibold'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {num || 'Any'}
              </button>
            ))}
          </div>
        </div>

        {/* Apply Button */}
        <button
          onClick={applyFilters}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <Search className="w-4 h-4" />
          Apply Filters
        </button>
      </div>
    </div>
  )
}
