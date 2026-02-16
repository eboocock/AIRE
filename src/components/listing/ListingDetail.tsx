'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Listing, ListingPhoto, Offer, Showing, Profile } from '@/types/database';

interface ListingWithRelations extends Listing {
  photos: ListingPhoto[];
  seller: Profile;
  offers: Offer[];
  showings: Showing[];
}

interface ListingDetailProps {
  listing: ListingWithRelations;
  isOwner: boolean;
  currentUserId?: string;
}

export function ListingDetail({ listing, isOwner, currentUserId }: ListingDetailProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'details' | 'offers' | 'showings'>('details');
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [showShowingForm, setShowShowingForm] = useState(false);

  const primaryPhoto = listing.photos?.find(p => p.is_primary) || listing.photos?.[0];
  const pendingOffers = listing.offers?.filter(o => o.status === 'pending') || [];
  const upcomingShowings = listing.showings?.filter(s =>
    ['requested', 'confirmed'].includes(s.status)
  ) || [];

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-600',
    active: 'bg-green-500',
    pending_review: 'bg-yellow-500',
    under_contract: 'bg-blue-500',
    sold: 'bg-purple-500',
    withdrawn: 'bg-red-500',
    expired: 'bg-gray-500',
  };

  const handleOfferAction = async (offerId: string, action: 'accepted' | 'rejected') => {
    const res = await fetch(`/api/offers/${offerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: action }),
    });

    if (res.ok) {
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href={isOwner ? '/dashboard' : '/'} className="text-gray-400 hover:text-white transition">
            <i className="fas fa-arrow-left mr-2" />
            {isOwner ? 'Dashboard' : 'Back'}
          </Link>
          {isOwner && (
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${statusColors[listing.status] || 'bg-gray-600'}`}>
                {listing.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Photo */}
            {listing.photos && listing.photos.length > 0 ? (
              <div className="rounded-xl overflow-hidden bg-gray-900">
                <div className="aspect-[16/10] relative">
                  <img
                    src={primaryPhoto?.url || '/placeholder.svg'}
                    alt={listing.street_address}
                    className="w-full h-full object-cover"
                  />
                </div>
                {listing.photos.length > 1 && (
                  <div className="p-3 flex gap-2 overflow-x-auto">
                    {listing.photos.slice(0, 6).map(photo => (
                      <div key={photo.id} className="w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
                        <img src={photo.url} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {listing.photos.length > 6 && (
                      <div className="w-20 h-14 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 text-sm flex-shrink-0">
                        +{listing.photos.length - 6}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-[16/10] rounded-xl bg-gray-900 flex items-center justify-center">
                <i className="fas fa-home text-4xl text-gray-700" />
              </div>
            )}

            {/* Price & Address */}
            <div>
              <div className="flex items-baseline justify-between">
                <h1 className="text-3xl font-bold text-white">
                  {listing.list_price ? `$${listing.list_price.toLocaleString()}` : 'Contact for Price'}
                </h1>
                {listing.ai_estimated_value && (
                  <span className="text-sm text-gray-400">
                    <i className="fas fa-robot mr-1 text-aire-400" />
                    AI est: ${listing.ai_estimated_value.toLocaleString()}
                  </span>
                )}
              </div>
              <p className="text-lg text-gray-300 mt-1">
                {listing.street_address}{listing.unit ? ` ${listing.unit}` : ''}
              </p>
              <p className="text-gray-500">
                {listing.city}, {listing.state} {listing.zip_code}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { icon: 'fa-bed', value: listing.beds, label: 'Beds' },
                { icon: 'fa-bath', value: listing.baths, label: 'Baths' },
                { icon: 'fa-ruler-combined', value: listing.sqft?.toLocaleString(), label: 'Sqft' },
                { icon: 'fa-calendar', value: listing.year_built, label: 'Built' },
              ].map((stat, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
                  <i className={`fas ${stat.icon} text-gray-500 mb-2`} />
                  <div className="text-white font-semibold">{stat.value || '—'}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            {isOwner && (
              <div className="flex border-b border-gray-800">
                {[
                  { key: 'details', label: 'Details' },
                  { key: 'offers', label: `Offers (${listing.offers?.length || 0})` },
                  { key: 'showings', label: `Showings (${listing.showings?.length || 0})` },
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`px-4 py-3 text-sm font-medium transition border-b-2 -mb-px ${
                      activeTab === tab.key
                        ? 'text-aire-400 border-aire-400'
                        : 'text-gray-500 border-transparent hover:text-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}

            {/* Details Tab */}
            {(activeTab === 'details' || !isOwner) && (
              <div className="space-y-6">
                {(listing.headline || listing.description || listing.ai_generated_description) && (
                  <div>
                    {listing.headline && (
                      <h2 className="text-xl font-semibold text-white mb-3">{listing.headline}</h2>
                    )}
                    <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                      {listing.description || listing.ai_generated_description}
                    </p>
                  </div>
                )}

                {/* Property Details */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Property Details</h3>
                  <div className="grid grid-cols-2 gap-y-3 gap-x-8 text-sm">
                    {[
                      { label: 'Property Type', value: listing.property_type },
                      { label: 'Lot Size', value: listing.lot_size ? `${listing.lot_size} acres` : null },
                      { label: 'Stories', value: listing.stories },
                      { label: 'Garage', value: listing.garage_spaces ? `${listing.garage_spaces} spaces` : null },
                      { label: 'Price/Sqft', value: listing.sqft && listing.list_price ? `$${Math.round(listing.list_price / listing.sqft)}` : null },
                    ].filter(d => d.value).map((detail, i) => (
                      <div key={i} className="flex justify-between">
                        <span className="text-gray-500">{detail.label}</span>
                        <span className="text-gray-300">{detail.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features */}
                {listing.features && Array.isArray(listing.features) && (listing.features as string[]).length > 0 && (
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {(listing.features as string[]).map((f: string) => (
                        <span key={f} className="px-3 py-1.5 bg-gray-800 rounded-full text-sm text-gray-300">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Offers Tab (owner only) */}
            {activeTab === 'offers' && isOwner && (
              <div className="space-y-4">
                {listing.offers && listing.offers.length > 0 ? (
                  listing.offers
                    .sort((a, b) => (b.ai_strength_score || 0) - (a.ai_strength_score || 0))
                    .map(offer => (
                    <div key={offer.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="text-xl font-bold text-white">
                            ${offer.offer_price.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-400">
                            {offer.buyer_name || 'Anonymous Buyer'}
                          </div>
                        </div>
                        <div className="text-right">
                          {offer.ai_strength_score && (
                            <div className={`text-sm font-medium ${
                              offer.ai_strength_score >= 75 ? 'text-green-400' :
                              offer.ai_strength_score >= 50 ? 'text-yellow-400' : 'text-red-400'
                            }`}>
                              AI Score: {offer.ai_strength_score}/100
                            </div>
                          )}
                          <span className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${
                            offer.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            offer.status === 'accepted' ? 'bg-green-500/20 text-green-400' :
                            offer.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                            'bg-gray-700 text-gray-400'
                          }`}>
                            {offer.status}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                        {offer.financing_type && (
                          <span><i className="fas fa-money-bill-wave mr-1" />{offer.financing_type}</span>
                        )}
                        {offer.closing_date && (
                          <span><i className="fas fa-calendar mr-1" />Close: {new Date(offer.closing_date).toLocaleDateString()}</span>
                        )}
                      </div>

                      {offer.status === 'pending' && (
                        <div className="flex items-center space-x-2 pt-3 border-t border-gray-800">
                          <button
                            onClick={() => handleOfferAction(offer.id, 'accepted')}
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleOfferAction(offer.id, 'rejected')}
                            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium rounded-lg transition"
                          >
                            Decline
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <i className="fas fa-inbox text-3xl mb-3" />
                    <p>No offers yet</p>
                  </div>
                )}
              </div>
            )}

            {/* Showings Tab (owner only) */}
            {activeTab === 'showings' && isOwner && (
              <div className="space-y-4">
                {listing.showings && listing.showings.length > 0 ? (
                  listing.showings.map(showing => (
                    <div key={showing.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-medium">{showing.buyer_name}</div>
                          <div className="text-sm text-gray-400 mt-1">
                            <i className="fas fa-calendar mr-1" />
                            {new Date(showing.requested_date).toLocaleDateString()} at {showing.requested_time_start}
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          showing.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                          showing.status === 'requested' ? 'bg-yellow-500/20 text-yellow-400' :
                          showing.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-gray-700 text-gray-400'
                        }`}>
                          {showing.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <i className="fas fa-calendar-alt text-3xl mb-3" />
                    <p>No showings scheduled</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            {isOwner ? (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-3">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Listing Actions</h3>
                {listing.status === 'draft' && (
                  <button className="w-full py-2 bg-aire-500 hover:bg-aire-600 text-white font-medium rounded-lg transition text-sm">
                    <i className="fas fa-rocket mr-2" />Publish Listing
                  </button>
                )}
                {listing.status === 'active' && (
                  <button className="w-full py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 font-medium rounded-lg transition text-sm">
                    <i className="fas fa-pause mr-2" />Pause Listing
                  </button>
                )}
                <Link
                  href={`/listings/${listing.id}/edit`}
                  className="block w-full py-2 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition text-sm text-center"
                >
                  <i className="fas fa-pen mr-2" />Edit Listing
                </Link>
              </div>
            ) : (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-3">
                {listing.status === 'active' && (
                  <>
                    <button
                      onClick={() => setShowOfferForm(true)}
                      className="w-full py-3 bg-aire-500 hover:bg-aire-600 text-white font-semibold rounded-lg transition"
                    >
                      <i className="fas fa-paper-plane mr-2" />Make an Offer
                    </button>
                    <button
                      onClick={() => setShowShowingForm(true)}
                      className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition"
                    >
                      <i className="fas fa-calendar-plus mr-2" />Request Showing
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Quick Stats */}
            {isOwner && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-sm font-medium text-gray-400 mb-4">Activity</h3>
                <div className="space-y-3">
                  {[
                    { icon: 'fa-eye', label: 'Views', value: listing.view_count || 0 },
                    { icon: 'fa-heart', label: 'Saves', value: listing.save_count || 0 },
                    { icon: 'fa-file-alt', label: 'Offers', value: listing.offers?.length || 0 },
                    { icon: 'fa-calendar', label: 'Showings', value: listing.showings?.length || 0 },
                  ].map((stat, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        <i className={`fas ${stat.icon} mr-2 w-4`} />{stat.label}
                      </span>
                      <span className="text-white font-medium">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AIRE Fee */}
            {listing.list_price && (
              <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-6">
                <h3 className="text-sm font-medium text-green-400 mb-2">
                  <i className="fas fa-piggy-bank mr-1" /> Your Savings
                </h3>
                <div className="text-2xl font-bold text-green-400">
                  ${(Math.round(listing.list_price * 0.06) - 499).toLocaleString()}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  vs. 6% traditional commission
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
