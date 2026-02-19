'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import type { Profile, Listing } from '@/types/database';
import { ListingCard } from './ListingCard';
import { getSupabaseClient } from '@/lib/supabase/client';

interface DashboardContentProps {
  user: User;
  profile: Profile | null;
  listings: any[];
  stats: {
    totalListings: number;
    activeListings: number;
    totalViews: number;
    pendingOffers: number;
    upcomingShowings: number;
  };
}

export function DashboardContent({ user, profile, listings, stats }: DashboardContentProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<string>('all');
  const [loggingOut, setLoggingOut] = useState(false);

  // Get display name from profile or user metadata
  const displayName = profile?.full_name?.split(' ')[0]
    || user.user_metadata?.full_name?.split(' ')[0]
    || user.email?.split('@')[0]
    || 'there';

  const handleLogout = async () => {
    setLoggingOut(true);
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const filteredListings = listings.filter(listing => {
    if (filter === 'all') return true;
    return listing.status === filter;
  });

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Welcome back, {displayName}
              </h1>
              <p className="text-gray-400 mt-1">
                Manage your listings and track your sales
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/listings/new"
                className="inline-flex items-center justify-center bg-aire-500 hover:bg-aire-600 text-white px-6 py-3 rounded-xl font-semibold transition"
              >
                <i className="fas fa-plus mr-2" />
                New Listing
              </Link>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="inline-flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-4 py-3 rounded-xl font-medium transition"
              >
                {loggingOut ? (
                  <i className="fas fa-spinner fa-spin" />
                ) : (
                  <>
                    <i className="fas fa-sign-out-alt mr-2" />
                    Logout
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatCard
            icon="fa-home"
            label="Total Listings"
            value={stats.totalListings}
            color="text-aire-400"
          />
          <StatCard
            icon="fa-broadcast-tower"
            label="Active"
            value={stats.activeListings}
            color="text-green-400"
          />
          <StatCard
            icon="fa-eye"
            label="Total Views"
            value={stats.totalViews.toLocaleString()}
            color="text-blue-400"
          />
          <StatCard
            icon="fa-file-signature"
            label="Pending Offers"
            value={stats.pendingOffers}
            color="text-yellow-400"
            highlight={stats.pendingOffers > 0}
          />
          <StatCard
            icon="fa-calendar-check"
            label="Upcoming Showings"
            value={stats.upcomingShowings}
            color="text-purple-400"
            highlight={stats.upcomingShowings > 0}
          />
        </div>

        {/* Listings Section */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl">
          {/* Filter Tabs */}
          <div className="border-b border-gray-800 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Your Listings</h2>
              <div className="flex space-x-2">
                {['all', 'draft', 'active', 'under_contract', 'sold'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      filter === status
                        ? 'bg-aire-500 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Listings Grid */}
          <div className="p-6">
            {filteredListings.length === 0 ? (
              <div className="text-center py-12">
                {listings.length === 0 ? (
                  <>
                    <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-home text-gray-600 text-2xl" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No listings yet</h3>
                    <p className="text-gray-400 mb-6">
                      Create your first listing and start selling with AI
                    </p>
                    <Link
                      href="/listings/new"
                      className="inline-flex items-center bg-aire-500 hover:bg-aire-600 text-white px-6 py-3 rounded-xl font-semibold transition"
                    >
                      <i className="fas fa-plus mr-2" />
                      Create Your First Listing
                    </Link>
                  </>
                ) : (
                  <>
                    <p className="text-gray-400">
                      No {filter} listings found
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        {stats.pendingOffers > 0 && (
          <div className="mt-8 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                  <i className="fas fa-file-signature text-yellow-500 text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-yellow-400">
                    You have {stats.pendingOffers} pending offer{stats.pendingOffers > 1 ? 's' : ''}
                  </h3>
                  <p className="text-yellow-200/70 text-sm">
                    Review and respond to buyer offers
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/offers"
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded-lg font-semibold transition"
              >
                Review Offers
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
  highlight,
}: {
  icon: string;
  label: string;
  value: string | number;
  color: string;
  highlight?: boolean;
}) {
  return (
    <div className={`bg-gray-900 border rounded-xl p-4 ${
      highlight ? 'border-yellow-500/50 bg-yellow-500/5' : 'border-gray-800'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <i className={`fas ${icon} ${color}`} />
        {highlight && (
          <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
        )}
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-gray-500 text-sm">{label}</div>
    </div>
  );
}
