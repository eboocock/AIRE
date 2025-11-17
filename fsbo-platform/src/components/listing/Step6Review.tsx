'use client'

import { useFormContext } from 'react-hook-form'
import type { ListingFormData } from '@/lib/validations/listing'
import { formatPrice } from '@/lib/utils'
import { Home, MapPin, Bed, Bath, Maximize, DollarSign, CheckCircle } from 'lucide-react'

export default function Step6Review() {
  const { watch } = useFormContext<ListingFormData>()
  const formData = watch()

  const propertyTypeLabels: Record<string, string> = {
    single_family: 'Single Family Home',
    condo: 'Condominium',
    townhouse: 'Townhouse',
    multi_family: 'Multi-Family',
    land: 'Land',
    mobile: 'Mobile/Manufactured Home',
    other: 'Other',
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Review & Publish</h2>
        <p className="text-slate-600">Review your listing details before publishing</p>
      </div>

      {/* Listing Preview Card */}
      <div className="border-2 border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-1">{formData.address_line1}</h3>
              <p className="text-primary-100 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {formData.city}, {formData.state} {formData.zip_code}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{formatPrice(formData.price || 0)}</div>
              <div className="text-xs text-primary-100 mt-1">List Price</div>
            </div>
          </div>
        </div>

        {/* Key Details */}
        <div className="p-6 border-b border-slate-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <Bed className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <div className="text-lg font-bold text-slate-900">{formData.bedrooms || 0}</div>
                <div className="text-xs text-slate-600">Bedrooms</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                <Bath className="w-5 h-5 text-secondary-600" />
              </div>
              <div>
                <div className="text-lg font-bold text-slate-900">{formData.bathrooms || 0}</div>
                <div className="text-xs text-slate-600">Bathrooms</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
                <Maximize className="w-5 h-5 text-accent-600" />
              </div>
              <div>
                <div className="text-lg font-bold text-slate-900">
                  {formData.sqft?.toLocaleString() || 'N/A'}
                </div>
                <div className="text-xs text-slate-600">Sq Ft</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">
                  {propertyTypeLabels[formData.property_type || 'other']}
                </div>
                <div className="text-xs text-slate-600">Type</div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {formData.description && (
          <div className="p-6 border-b border-slate-200">
            <h4 className="font-semibold text-slate-900 mb-2">Description</h4>
            <p className="text-slate-700 text-sm leading-relaxed">{formData.description}</p>
          </div>
        )}

        {/* Features */}
        {formData.features && formData.features.length > 0 && (
          <div className="p-6 border-b border-slate-200">
            <h4 className="font-semibold text-slate-900 mb-3">Features</h4>
            <div className="flex flex-wrap gap-2">
              {formData.features.map((feature, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Additional Details */}
        <div className="p-6">
          <h4 className="font-semibold text-slate-900 mb-3">Additional Details</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {formData.year_built && (
              <div className="flex justify-between">
                <span className="text-slate-600">Year Built:</span>
                <span className="font-semibold text-slate-900">{formData.year_built}</span>
              </div>
            )}
            {formData.lot_size && (
              <div className="flex justify-between">
                <span className="text-slate-600">Lot Size:</span>
                <span className="font-semibold text-slate-900">{formData.lot_size} acres</span>
              </div>
            )}
            {formData.parking_spaces && (
              <div className="flex justify-between">
                <span className="text-slate-600">Parking:</span>
                <span className="font-semibold text-slate-900">{formData.parking_spaces} spaces</span>
              </div>
            )}
            {formData.garage_spaces && (
              <div className="flex justify-between">
                <span className="text-slate-600">Garage:</span>
                <span className="font-semibold text-slate-900">{formData.garage_spaces} spaces</span>
              </div>
            )}
            {formData.hoa_fee && (
              <div className="flex justify-between">
                <span className="text-slate-600">HOA Fee:</span>
                <span className="font-semibold text-slate-900">{formatPrice(formData.hoa_fee)}/mo</span>
              </div>
            )}
            {formData.property_tax && (
              <div className="flex justify-between">
                <span className="text-slate-600">Property Tax:</span>
                <span className="font-semibold text-slate-900">{formatPrice(formData.property_tax)}/yr</span>
              </div>
            )}
          </div>

          {/* Amenities */}
          <div className="mt-4 flex flex-wrap gap-2">
            {formData.has_ac && (
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                ❄️ A/C
              </span>
            )}
            {formData.has_heating && (
              <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-semibold">
                🔥 Heating
              </span>
            )}
            {formData.has_fireplace && (
              <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-semibold">
                🔥 Fireplace
              </span>
            )}
            {formData.has_pool && (
              <span className="px-3 py-1 bg-cyan-50 text-cyan-700 rounded-full text-xs font-semibold">
                🏊 Pool
              </span>
            )}
            {formData.has_basement && (
              <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold">
                🏠 Basement
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Publishing Checklist */}
      <div className="card bg-green-50 border-2 border-green-200">
        <h4 className="font-semibold text-green-900 mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Before You Publish
        </h4>
        <div className="space-y-2">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              required
              className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300 rounded"
            />
            <span className="text-sm text-green-800">
              I confirm that all information provided is accurate and truthful
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              required
              className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300 rounded"
            />
            <span className="text-sm text-green-800">
              I understand that I can edit this listing anytime after publishing
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              required
              className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300 rounded"
            />
            <span className="text-sm text-green-800">
              I agree to respond promptly to buyer inquiries
            </span>
          </label>
        </div>
      </div>

      {/* What Happens Next */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">🎉 What happens after you publish?</h4>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">1.</span>
            <span>Your listing will be live and searchable on AIRE immediately</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">2.</span>
            <span>Buyers can view your listing and submit showing requests (free)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">3.</span>
            <span>
              When you're ready to accept offers, unlock the transaction package for $499
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5">4.</span>
            <span>You'll get access to offer management, legal documents, and closing tools</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
