'use client'

import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import type { ListingFormData } from '@/lib/validations/listing'
import { Sparkles } from 'lucide-react'

const COMMON_FEATURES = [
  'Hardwood Floors',
  'Updated Kitchen',
  'Granite Countertops',
  'Stainless Steel Appliances',
  'Walk-in Closet',
  'Master Suite',
  'Open Floor Plan',
  'High Ceilings',
  'Natural Light',
  'Updated Bathrooms',
  'Deck/Patio',
  'Fenced Yard',
  'Garden',
  'Recently Renovated',
  'Smart Home Features',
  'Energy Efficient Windows',
  'New Roof',
  'Fresh Paint',
]

export default function Step4Description() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ListingFormData>()

  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(watch('features') || [])
  const description = watch('description')

  const toggleFeature = (feature: string) => {
    const newFeatures = selectedFeatures.includes(feature)
      ? selectedFeatures.filter((f) => f !== feature)
      : [...selectedFeatures, feature]

    setSelectedFeatures(newFeatures)
    setValue('features', newFeatures)
  }

  const generateDescription = () => {
    const formData = watch()
    const parts = []

    // Opening
    if (formData.bedrooms && formData.bathrooms) {
      parts.push(
        `Beautiful ${formData.bedrooms} bedroom, ${formData.bathrooms} bathroom ${
          formData.property_type === 'single_family'
            ? 'home'
            : formData.property_type?.replace('_', ' ')
        } in ${formData.city}, Washington.`
      )
    }

    // Square footage
    if (formData.sqft) {
      parts.push(`This ${formData.sqft.toLocaleString()} sq ft property offers spacious living areas.`)
    }

    // Features
    if (selectedFeatures.length > 0) {
      parts.push(`Features include: ${selectedFeatures.slice(0, 5).join(', ')}.`)
    }

    // Special amenities
    const amenities = []
    if (formData.has_pool) amenities.push('a pool')
    if (formData.has_fireplace) amenities.push('a fireplace')
    if (formData.has_basement) amenities.push('a basement')
    if (amenities.length > 0) {
      parts.push(`Property includes ${amenities.join(', ')}.`)
    }

    // Location
    parts.push(
      `Located in the desirable ${formData.city} area, this property is perfect for buyers looking for quality and value.`
    )

    // Closing
    parts.push('Schedule your showing today!')

    setValue('description', parts.join(' '))
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Description & Features</h2>
        <p className="text-slate-600">Tell buyers what makes your property special</p>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
            Listing Title (optional)
          </label>
          <input
            id="title"
            type="text"
            {...register('title')}
            className="input"
            placeholder="Charming 3BR Home in Downtown Seattle"
          />
          <p className="mt-1 text-xs text-slate-500">
            Leave blank to auto-generate from address and property details
          </p>
        </div>

        {/* Description */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="description" className="block text-sm font-medium text-slate-700">
              Property Description
            </label>
            <button
              type="button"
              onClick={generateDescription}
              className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-semibold"
            >
              <Sparkles className="w-3 h-3" />
              Generate with AI
            </button>
          </div>
          <textarea
            id="description"
            {...register('description')}
            className="input min-h-[150px]"
            placeholder="Describe your property... What makes it special? What upgrades have been made? What do you love about the neighborhood?"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-slate-500">Minimum 50 characters recommended</p>
            <p className="text-xs text-slate-500">{description?.length || 0} characters</p>
          </div>
        </div>

        {/* Property Features */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Select Property Features
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {COMMON_FEATURES.map((feature) => (
              <button
                key={feature}
                type="button"
                onClick={() => toggleFeature(feature)}
                className={`px-3 py-2 text-sm rounded-lg border-2 transition-all ${
                  selectedFeatures.includes(feature)
                    ? 'border-primary-500 bg-primary-50 text-primary-700 font-semibold'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                {feature}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {selectedFeatures.length} feature{selectedFeatures.length !== 1 ? 's' : ''} selected
          </p>
        </div>

        {/* Amenities Checkboxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-3">
            <input
              id="has_ac"
              type="checkbox"
              {...register('has_ac')}
              className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-slate-300 rounded"
            />
            <label htmlFor="has_ac" className="text-sm font-medium text-slate-700">
              Air Conditioning
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="has_heating"
              type="checkbox"
              {...register('has_heating')}
              className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-slate-300 rounded"
            />
            <label htmlFor="has_heating" className="text-sm font-medium text-slate-700">
              Heating System
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="has_fireplace"
              type="checkbox"
              {...register('has_fireplace')}
              className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-slate-300 rounded"
            />
            <label htmlFor="has_fireplace" className="text-sm font-medium text-slate-700">
              Fireplace
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="has_pool"
              type="checkbox"
              {...register('has_pool')}
              className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-slate-300 rounded"
            />
            <label htmlFor="has_pool" className="text-sm font-medium text-slate-700">
              Swimming Pool
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="has_basement"
              type="checkbox"
              {...register('has_basement')}
              className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-slate-300 rounded"
            />
            <label htmlFor="has_basement" className="text-sm font-medium text-slate-700">
              Basement
            </label>
          </div>
        </div>

        {/* Heating Type (conditional) */}
        {watch('has_heating') && (
          <div>
            <label htmlFor="heating_type" className="block text-sm font-medium text-slate-700 mb-2">
              Heating Type
            </label>
            <input
              id="heating_type"
              type="text"
              {...register('heating_type')}
              className="input"
              placeholder="e.g., Forced Air, Radiant, Heat Pump"
            />
          </div>
        )}
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <p className="text-sm text-purple-800">
          <strong>Writing Tips:</strong>
        </p>
        <ul className="mt-2 space-y-1 text-sm text-purple-700 list-disc list-inside">
          <li>Highlight unique features and recent upgrades</li>
          <li>Describe the neighborhood and nearby amenities</li>
          <li>Be honest and accurate - it builds trust with buyers</li>
          <li>Use the AI generator as a starting point, then personalize</li>
        </ul>
      </div>
    </div>
  )
}
