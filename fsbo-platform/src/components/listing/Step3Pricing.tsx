'use client'

import { useFormContext } from 'react-hook-form'
import type { ListingFormData } from '@/lib/validations/listing'
import { formatPrice } from '@/lib/utils'

export default function Step3Pricing() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<ListingFormData>()

  const price = watch('price')
  const commissionSaved = price ? price * 0.05 : 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Pricing</h2>
        <p className="text-slate-600">Set your listing price and additional fees</p>
      </div>

      <div className="space-y-4">
        {/* List Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-slate-700 mb-2">
            List Price <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">$</span>
            <input
              id="price"
              type="number"
              {...register('price', { valueAsNumber: true })}
              className="input pl-8"
              placeholder="500000"
              min="1000"
            />
          </div>
          {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
          {price >= 1000 && (
            <p className="mt-2 text-sm text-slate-600">
              List Price: <span className="font-semibold">{formatPrice(price)}</span>
            </p>
          )}
        </div>

        {/* Commission Savings Calculator */}
        {price >= 1000 && (
          <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-xl p-6">
            <h3 className="text-lg font-bold text-green-900 mb-3">💰 Your Savings with FSBO</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-700">Traditional 5% Commission:</span>
                <span className="font-semibold text-slate-900">{formatPrice(commissionSaved)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-700">AIRE Platform Fee:</span>
                <span className="font-semibold text-green-600">$0 (Free to List!)</span>
              </div>
              <div className="border-t-2 border-green-300 pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-green-900 font-bold">You Save:</span>
                  <span className="text-2xl font-bold text-green-600">{formatPrice(commissionSaved)}</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-green-700 mt-3">
              * Pay only $499 when you're ready to accept offers and close your sale
            </p>
          </div>
        )}

        {/* HOA Fee */}
        <div>
          <label htmlFor="hoa_fee" className="block text-sm font-medium text-slate-700 mb-2">
            HOA Fee (monthly, if applicable)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">$</span>
            <input
              id="hoa_fee"
              type="number"
              {...register('hoa_fee', { valueAsNumber: true })}
              className="input pl-8"
              placeholder="250"
              min="0"
            />
          </div>
          {errors.hoa_fee && <p className="mt-1 text-sm text-red-600">{errors.hoa_fee.message}</p>}
        </div>

        {/* Property Tax */}
        <div>
          <label htmlFor="property_tax" className="block text-sm font-medium text-slate-700 mb-2">
            Property Tax (annual)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">$</span>
            <input
              id="property_tax"
              type="number"
              {...register('property_tax', { valueAsNumber: true })}
              className="input pl-8"
              placeholder="5000"
              min="0"
            />
          </div>
          {errors.property_tax && (
            <p className="mt-1 text-sm text-red-600">{errors.property_tax.message}</p>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Pricing Tips:</strong>
        </p>
        <ul className="mt-2 space-y-1 text-sm text-blue-700 list-disc list-inside">
          <li>Research comparable homes in your area</li>
          <li>Consider recent sales in your neighborhood</li>
          <li>Price competitively to attract serious buyers</li>
          <li>You can always adjust the price later</li>
        </ul>
      </div>
    </div>
  )
}
