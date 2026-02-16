'use client';

import Link from 'next/link';
import Image from 'next/image';

interface ListingCardProps {
  listing: any;
}

const statusColors: Record<string, string> = {
  draft: 'bg-gray-500',
  pending_review: 'bg-yellow-500',
  active: 'bg-green-500',
  under_contract: 'bg-blue-500',
  sold: 'bg-purple-500',
  withdrawn: 'bg-red-500',
  expired: 'bg-gray-600',
};

const statusLabels: Record<string, string> = {
  draft: 'Draft',
  pending_review: 'Pending Review',
  active: 'Active',
  under_contract: 'Under Contract',
  sold: 'Sold',
  withdrawn: 'Withdrawn',
  expired: 'Expired',
};

export function ListingCard({ listing }: ListingCardProps) {
  const primaryPhoto = listing.photos?.find((p: any) => p.is_primary) || listing.photos?.[0];
  const pendingOffers = listing.offers?.filter((o: any) => o.status === 'pending').length || 0;
  const upcomingShowings = listing.showings?.filter((s: any) =>
    ['requested', 'confirmed'].includes(s.status)
  ).length || 0;

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="block bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden hover:border-aire-500/50 transition group"
    >
      {/* Photo */}
      <div className="relative aspect-[4/3] bg-gray-800">
        {primaryPhoto ? (
          <Image
            src={primaryPhoto.url}
            alt={listing.street_address}
            fill
            className="object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <i className="fas fa-home text-gray-600 text-4xl" />
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`${statusColors[listing.status]} text-white text-xs font-medium px-2 py-1 rounded-full`}>
            {statusLabels[listing.status]}
          </span>
        </div>

        {/* Notifications */}
        {(pendingOffers > 0 || upcomingShowings > 0) && (
          <div className="absolute top-3 right-3 flex gap-2">
            {pendingOffers > 0 && (
              <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                {pendingOffers} offer{pendingOffers > 1 ? 's' : ''}
              </span>
            )}
            {upcomingShowings > 0 && (
              <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {upcomingShowings} showing{upcomingShowings > 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-white group-hover:text-aire-400 transition">
              {listing.street_address}
            </h3>
            <p className="text-gray-400 text-sm">
              {listing.city}, {listing.state} {listing.zip_code}
            </p>
          </div>
          {listing.list_price && (
            <div className="text-right">
              <div className="font-bold text-lg text-white">
                ${listing.list_price.toLocaleString()}
              </div>
            </div>
          )}
        </div>

        {/* Property Details */}
        <div className="flex items-center gap-4 text-sm text-gray-400">
          {listing.beds && (
            <span>
              <i className="fas fa-bed mr-1" />
              {listing.beds} bed
            </span>
          )}
          {listing.baths && (
            <span>
              <i className="fas fa-bath mr-1" />
              {listing.baths} bath
            </span>
          )}
          {listing.sqft && (
            <span>
              <i className="fas fa-ruler-combined mr-1" />
              {listing.sqft.toLocaleString()} sqft
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-700 text-xs text-gray-500">
          <span>
            <i className="fas fa-eye mr-1" />
            {listing.view_count || 0} views
          </span>
          <span>
            <i className="fas fa-heart mr-1" />
            {listing.save_count || 0} saves
          </span>
          {listing.days_on_market !== null && listing.status === 'active' && (
            <span>
              <i className="fas fa-clock mr-1" />
              {listing.days_on_market} days
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
