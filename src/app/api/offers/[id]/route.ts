import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { status } = body;

  if (!['accepted', 'rejected', 'countered', 'withdrawn'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  // Fetch the offer and verify ownership of the listing
  const { data: offer, error: offerError } = await supabase
    .from('offers')
    .select('*, listing:listings!listing_id(seller_id, status)')
    .eq('id', params.id)
    .single();

  if (offerError || !offer) {
    return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
  }

  const listing = offer.listing as any;

  // Only the listing seller can accept/reject, buyer can withdraw
  if (status === 'withdrawn') {
    if (offer.buyer_id !== user.id) {
      return NextResponse.json({ error: 'Only the buyer can withdraw' }, { status: 403 });
    }
  } else {
    if (listing.seller_id !== user.id) {
      return NextResponse.json({ error: 'Only the seller can respond' }, { status: 403 });
    }
  }

  // Update the offer
  const { data: updatedOffer, error: updateError } = await supabase
    .from('offers')
    .update({
      status,
      responded_at: new Date().toISOString(),
    })
    .eq('id', params.id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ error: 'Failed to update offer' }, { status: 500 });
  }

  // If accepted, update listing status to under_contract
  if (status === 'accepted') {
    await supabase
      .from('listings')
      .update({
        status: 'under_contract',
        under_contract_at: new Date().toISOString(),
      })
      .eq('id', offer.listing_id);

    // Reject all other pending offers
    await supabase
      .from('offers')
      .update({ status: 'rejected', responded_at: new Date().toISOString() })
      .eq('listing_id', offer.listing_id)
      .eq('status', 'pending')
      .neq('id', params.id);
  }

  return NextResponse.json(updatedOffer);
}
