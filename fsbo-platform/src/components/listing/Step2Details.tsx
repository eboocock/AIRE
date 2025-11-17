'use client'

import { useFormContext } from 'react-hook-form'
import type { ListingFormData } from '@/lib/validations/listing'

export default function Step2Details() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ListingFormData>()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Property Details</h2>
        <p className="text-slate-600">Provide key information about your property</p>
      </div>

      <div className="space-y-4">
        {/* Property Type */}
        <div>
          <label htmlFor="property_type" className="block text-sm font-medium text-slate-700 mb-2">
            Property Type <span className="text-red-500">*</span>
          </label>
          <select id="property_type" {...register('property_type')} className="input">
            <option value="">Select property type</option>
            <option value="single_family">Single Family Home</option>
            <option value="condo">Condominium</option>
            <option value="townhouse">Townhouse</option>
            <option value="multi_family">Multi-Family</option>
            <option value="land">Land</option>
            <option value="mobile">Mobile/Manufactured Home</option>
            <option value="other">Other</option>
          </select>
          {errors.property_type && (
            <p className="mt-1 text-sm text-red-600">{errors.property_type.message}</p>
          )}
        </div>

        {/* Bedrooms and Bathrooms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="bedrooms" className="block text-sm font-medium text-slate-700 mb-2">
              Bedrooms <span className="text-red-500">*</span>
            </label>
            <input
              id="bedrooms"
              type="number"
              {...register('bedrooms', { valueAsNumber: true })}
              className="input"
              placeholder="3"
              min="0"
              max="20"
            />
            {errors.bedrooms && <p className="mt-1 text-sm text-red-600">{errors.bedrooms.message}</p>}
          </div>

          <div>
            <label htmlFor="bathrooms" className="block text-sm font-medium text-slate-700 mb-2">
              Bathrooms <span className="text-red-500">*</span>
            </label>
            <input
              id="bathrooms"
              type="number"
              step="0.5"
              {...register('bathrooms', { valueAsNumber: true })}
              className="input"
              placeholder="2.5"
              min="0"
              max="20"
            />
            {errors.bathrooms && <p className="mt-1 text-sm text-red-600">{errors.bathrooms.message}</p>}
          </div>
        </div>

        {/* Square Footage and Lot Size */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="sqft" className="block text-sm font-medium text-slate-700 mb-2">
              Square Footage
            </label>
            <input
              id="sqft"
              type="number"
              {...register('sqft', { valueAsNumber: true })}
              className="input"
              placeholder="2000"
              min="1"
            />
            {errors.sqft && <p className="mt-1 text-sm text-red-600">{errors.sqft.message}</p>}
          </div>

          <div>
            <label htmlFor="lot_size" className="block text-sm font-medium text-slate-700 mb-2">
              Lot Size (acres)
            </label>
            <input
              id="lot_size"
              type="number"
              step="0.01"
              {...register('lot_size', { valueAsNumber: true })}
              className="input"
              placeholder="0.25"
              min="0"
            />
            {errors.lot_size && <p className="mt-1 text-sm text-red-600">{errors.lot_size.message}</p>}
          </div>
        </div>

        {/* Year Built */}
        <div>
          <label htmlFor="year_built" className="block text-sm font-medium text-slate-700 mb-2">
            Year Built
          </label>
          <input
            id="year_built"
            type="number"
            {...register('year_built', { valueAsNumber: true })}
            className="input"
            placeholder="2010"
            min="1800"
            max={new Date().getFullYear() + 1}
          />
          {errors.year_built && <p className="mt-1 text-sm text-red-600">{errors.year_built.message}</p>}
        </div>

        {/* Parking */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="parking_spaces" className="block text-sm font-medium text-slate-700 mb-2">
              Total Parking Spaces
            </label>
            <input
              id="parking_spaces"
              type="number"
              {...register('parking_spaces', { valueAsNumber: true })}
              className="input"
              placeholder="2"
              min="0"
            />
          </div>

          <div>
            <label htmlFor="garage_spaces" className="block text-sm font-medium text-slate-700 mb-2">
              Garage Spaces
            </label>
            <input
              id="garage_spaces"
              type="number"
              {...register('garage_spaces', { valueAsNumber: true })}
              className="input"
              placeholder="2"
              min="0"
            />
          </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-800">
          <strong>Tip:</strong> Accurate property details help buyers find your listing and make informed decisions. Be as detailed as possible!
        </p>
      </div>
    </div>
  )
}
