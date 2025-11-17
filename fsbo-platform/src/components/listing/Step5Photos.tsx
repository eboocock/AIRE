'use client'

import { useFormContext } from 'react-hook-form'
import type { ListingFormData } from '@/lib/validations/listing'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

export default function Step5Photos() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ListingFormData>()

  const photos = watch('photos') || []

  // TODO: Implement actual file upload to Supabase Storage
  // For now, this is a placeholder UI

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Photos & Media</h2>
        <p className="text-slate-600">Add photos and virtual tours to showcase your property</p>
      </div>

      <div className="space-y-4">
        {/* Photo Upload Area */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Property Photos <span className="text-slate-500">(Up to 30 photos)</span>
          </label>

          {/* Upload Zone */}
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center hover:border-primary-400 transition-colors bg-slate-50">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-900 mb-1">
                  Drag and drop photos here
                </p>
                <p className="text-sm text-slate-600 mb-3">or click to browse from your computer</p>
                <button
                  type="button"
                  className="btn-primary inline-block"
                >
                  Choose Files
                </button>
              </div>
              <p className="text-xs text-slate-500">
                Accepted formats: JPG, PNG, WebP • Max file size: 10MB each
              </p>
            </div>
          </div>

          {/* Photo Preview Grid - Placeholder */}
          {photos.length > 0 && (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square bg-slate-200 rounded-lg overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-slate-400" />
                    </div>
                  </div>
                  <button
                    type="button"
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-2 left-2 bg-primary-500 text-white text-xs font-semibold px-2 py-1 rounded">
                      Cover Photo
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Coming Soon Notice */}
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Photo Upload Coming Soon:</strong> Photo upload functionality will be available in the next update. For now, you can save your listing as a draft and add photos later.
            </p>
          </div>
        </div>

        {/* Video Tour URL */}
        <div>
          <label htmlFor="video_url" className="block text-sm font-medium text-slate-700 mb-2">
            Video Tour URL (optional)
          </label>
          <input
            id="video_url"
            type="url"
            {...register('video_url')}
            className="input"
            placeholder="https://youtube.com/watch?v=..."
          />
          {errors.video_url && <p className="mt-1 text-sm text-red-600">{errors.video_url.message}</p>}
          <p className="mt-1 text-xs text-slate-500">
            YouTube, Vimeo, or other video hosting platform links
          </p>
        </div>

        {/* Virtual Tour URL */}
        <div>
          <label htmlFor="virtual_tour_url" className="block text-sm font-medium text-slate-700 mb-2">
            Virtual Tour / 3D Tour URL (optional)
          </label>
          <input
            id="virtual_tour_url"
            type="url"
            {...register('virtual_tour_url')}
            className="input"
            placeholder="https://my.matterport.com/..."
          />
          {errors.virtual_tour_url && (
            <p className="mt-1 text-sm text-red-600">{errors.virtual_tour_url.message}</p>
          )}
          <p className="mt-1 text-xs text-slate-500">
            Matterport, Zillow 3D Home, or similar virtual tour links
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Photo Tips:</strong>
        </p>
        <ul className="mt-2 space-y-1 text-sm text-blue-700 list-disc list-inside">
          <li>Take photos in good natural lighting (morning or late afternoon)</li>
          <li>Clean and declutter rooms before photographing</li>
          <li>Use landscape orientation for most photos</li>
          <li>Include exterior shots, all rooms, and special features</li>
          <li>Your first photo will be the cover photo shown in search results</li>
        </ul>
      </div>
    </div>
  )
}
