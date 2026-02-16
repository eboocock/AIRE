import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ListingDetail } from '@/components/listing/ListingDetail';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: listing } = await supabase
    .from('listings')
    .select('street_address, city, state, list_price, headline')
    .eq('id', params.id)
    .single();

  if (!listing) return { title: 'Listing Not Found | AIREA' };

  return {
    title: `${listing.headline || listing.street_address} | AIREA`,
    description: `${listing.street_address}, ${listing.city}, ${listing.state} - $${listing.list_price?.toLocaleString() || 'Contact for price'}`,
  };
}

export default async function ListingPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: listing, error } = await supabase
    .from('listings')
    .select(`
      *,
      photos:listing_photos(id, url, caption, room_type, is_primary, sort_order),
      seller:profiles!seller_id(id, full_name, avatar_url, email, phone),
      offers:offers(id, offer_price, status, financing_type, closing_date, ai_strength_score, buyer_name, submitted_at),
      showings:showings(id, buyer_name, requested_date, requested_time_start, status)
    `)
    .eq('id', params.id)
    .single();

  if (error || !listing) {
    notFound();
  }

  const isOwner = user?.id === listing.seller_id;

  // Non-owners can only see active listings
  if (!isOwner && !['active', 'under_contract'].includes(listing.status)) {
    notFound();
  }

  return <ListingDetail listing={listing as any} isOwner={isOwner} currentUserId={user?.id} />;
}
