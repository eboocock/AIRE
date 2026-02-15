import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const createShowingSchema = z.object({
  listing_id: z.string().uuid(),
  buyer_name: z.string().min(1),
  buyer_email: z.string().email().optional(),
  buyer_phone: z.string().optional(),
  requested_date: z.string(),
  requested_time_start: z.string(),
  requested_time_end: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const listingId = searchParams.get('listing_id');

  let query = supabase
    .from('showings')
    .select(`
      *,
      listing:listings!listing_id(id, street_address, city, state, seller_id)
    `)
    .order('requested_date', { ascending: true });

  if (listingId) {
    query = query.eq('listing_id', listingId);
  }

  const { data: showings, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Filter to only show showings for user's listings or their own requests
  const filteredShowings = showings?.filter(s => {
    const listing = s.listing as any;
    return listing?.seller_id === user.id || s.buyer_id === user.id;
  });

  return NextResponse.json(filteredShowings || []);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const body = await request.json();
  const parsed = createShowingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { data: { user } } = await supabase.auth.getUser();

  // Verify listing exists and is active
  const { data: listing } = await supabase
    .from('listings')
    .select('id, status, seller_id')
    .eq('id', parsed.data.listing_id)
    .single();

  if (!listing) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
  }

  if (listing.status !== 'active') {
    return NextResponse.json({ error: 'Listing is not accepting showings' }, { status: 400 });
  }

  const { data: showing, error } = await supabase
    .from('showings')
    .insert({
      ...parsed.data,
      buyer_id: user?.id || null,
      status: 'requested',
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(showing, { status: 201 });
}
