'use client'

import { useState } from 'react'
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react'

interface Photo {
  url: string
  order: number
  caption?: string
}

export default function PhotoGallery({ photos, address }: { photos: Photo[]; address: string }) {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null)

  if (!photos || photos.length === 0) {
    return (
      <div className="bg-slate-200 h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-slate-300 rounded-full mx-auto mb-4 flex items-center justify-center">
            <ImageIcon className="w-10 h-10 text-slate-500" />
          </div>
          <p className="text-slate-600 font-semibold">No photos available</p>
        </div>
      </div>
    )
  }

  const sortedPhotos = [...photos].sort((a, b) => a.order - b.order)

  const openLightbox = (index: number) => {
    setSelectedPhoto(index)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setSelectedPhoto(null)
    document.body.style.overflow = 'auto'
  }

  const nextPhoto = () => {
    if (selectedPhoto !== null) {
      setSelectedPhoto((selectedPhoto + 1) % sortedPhotos.length)
    }
  }

  const prevPhoto = () => {
    if (selectedPhoto !== null) {
      setSelectedPhoto((selectedPhoto - 1 + sortedPhotos.length) % sortedPhotos.length)
    }
  }

  return (
    <>
      {/* Photo Grid */}
      <div className="grid grid-cols-4 gap-2 h-96">
        {/* Main Photo */}
        <div className="col-span-4 md:col-span-2 row-span-2 relative group cursor-pointer" onClick={() => openLightbox(0)}>
          <img
            src={sortedPhotos[0].url}
            alt={`${address} - Main photo`}
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
            <span className="text-white opacity-0 group-hover:opacity-100 font-semibold">
              View Photo
            </span>
          </div>
        </div>

        {/* Thumbnail Grid */}
        {sortedPhotos.slice(1, 5).map((photo, index) => (
          <div
            key={index}
            className="relative group cursor-pointer"
            onClick={() => openLightbox(index + 1)}
          >
            <img
              src={photo.url}
              alt={`${address} - Photo ${index + 2}`}
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg" />
          </div>
        ))}

        {/* View All Photos Button */}
        {sortedPhotos.length > 5 && (
          <button
            onClick={() => openLightbox(0)}
            className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:bg-slate-50 transition-colors"
          >
            View All {sortedPhotos.length} Photos
          </button>
        )}
      </div>

      {/* Lightbox */}
      {selectedPhoto !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-slate-300 z-10"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Previous Button */}
          <button
            onClick={prevPhoto}
            className="absolute left-4 text-white hover:text-slate-300 z-10"
          >
            <ChevronLeft className="w-12 h-12" />
          </button>

          {/* Photo */}
          <div className="max-w-6xl max-h-[90vh] mx-4">
            <img
              src={sortedPhotos[selectedPhoto].url}
              alt={`${address} - Photo ${selectedPhoto + 1}`}
              className="max-w-full max-h-[90vh] object-contain"
            />
            {sortedPhotos[selectedPhoto].caption && (
              <p className="text-white text-center mt-4">{sortedPhotos[selectedPhoto].caption}</p>
            )}
            <p className="text-slate-400 text-center mt-2">
              {selectedPhoto + 1} / {sortedPhotos.length}
            </p>
          </div>

          {/* Next Button */}
          <button
            onClick={nextPhoto}
            className="absolute right-4 text-white hover:text-slate-300 z-10"
          >
            <ChevronRight className="w-12 h-12" />
          </button>
        </div>
      )}
    </>
  )
}
