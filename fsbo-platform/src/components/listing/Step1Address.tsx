'use client'

import { useFormContext } from 'react-hook-form'
import type { ListingFormData } from '@/lib/validations/listing'

export default function Step1Address() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ListingFormData>()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Property Address</h2>
        <p className="text-slate-600">Enter the address of the property you're selling</p>
      </div>

      <div className="space-y-4">
        {/* Street Address */}
        <div>
          <label htmlFor="address_line1" className="block text-sm font-medium text-slate-700 mb-2">
            Street Address <span className="text-red-500">*</span>
          </label>
          <input
            id="address_line1"
            type="text"
            {...register('address_line1')}
            className="input"
            placeholder="123 Main Street"
          />
          {errors.address_line1 && (
            <p className="mt-1 text-sm text-red-600">{errors.address_line1.message}</p>
          )}
        </div>

        {/* Address Line 2 */}
        <div>
          <label htmlFor="address_line2" className="block text-sm font-medium text-slate-700 mb-2">
            Apartment, suite, etc. (optional)
          </label>
          <input
            id="address_line2"
            type="text"
            {...register('address_line2')}
            className="input"
            placeholder="Apt 4B"
          />
        </div>

        {/* City, State, ZIP */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label htmlFor="city" className="block text-sm font-medium text-slate-700 mb-2">
              City <span className="text-red-500">*</span>
            </label>
            <input
              id="city"
              type="text"
              {...register('city')}
              className="input"
              placeholder="Seattle"
            />
            {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
          </div>

          <div className="md:col-span-1">
            <label htmlFor="state" className="block text-sm font-medium text-slate-700 mb-2">
              State
            </label>
            <input
              id="state"
              type="text"
              {...register('state')}
              className="input bg-slate-100"
              value="WA"
              disabled
            />
          </div>

          <div className="md:col-span-1">
            <label htmlFor="zip_code" className="block text-sm font-medium text-slate-700 mb-2">
              ZIP Code <span className="text-red-500">*</span>
            </label>
            <input
              id="zip_code"
              type="text"
              {...register('zip_code')}
              className="input"
              placeholder="98101"
              maxLength={5}
            />
            {errors.zip_code && <p className="mt-1 text-sm text-red-600">{errors.zip_code.message}</p>}
          </div>
        </div>

        {/* County */}
        <div>
          <label htmlFor="county" className="block text-sm font-medium text-slate-700 mb-2">
            County (optional)
          </label>
          <input
            id="county"
            type="text"
            {...register('county')}
            className="input"
            placeholder="King County"
          />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Make sure the address is accurate. This will be used to generate your listing's public URL and help buyers find your property.
        </p>
      </div>
    </div>
  )
}
