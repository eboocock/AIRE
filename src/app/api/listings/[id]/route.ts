import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/listings/[id] - Get a single listing
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { id } = params;

    const { data: listing, error } = await supabase
      .from('listings')
      .select(`
        *,
        seller:profiles(id, full_name, email, phone, avatar_url),
        photos:listing_photos(id, url, caption, room_type, is_primary, sort_order),
        offers:offers(
          id, offer_price, buyer_name, buyer_email, financing_type,
          closing_date, status, submitted_at, ai_strength_score
        ),
        showings:showings(
          id, buyer_name, requested_date, requested_time_start,
          status, buyer_feedback, buyer_rating
        ),
        documents:documents(
          id, name, document_type, status, requires_signature, signed_at
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
      }
      console.error('Listing fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch listing' }, { status: 500 });
    }

    return NextResponse.json({ listing });
  } catch (error: any) {
    console.error('Listing API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/listings/[id] - Update a listing
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { id } = params;

    // Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify ownership
    const { data: existing } = await supabase
      .from('listings')
      .select('seller_id')
      .eq('id', id)
      .single();

    if (!existing || existing.seller_id !== user.id) {
      return NextResponse.json({ error: 'Not authorized to update this listing' }, { status: 403 });
    }

    // Update listing
    const body = await request.json();
    const { data: listing, error } = await supabase
      .from('listings')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Listing update error:', error);
      return NextResponse.json({ error: 'Failed to update listing' }, { status: 500 });
    }

    return NextResponse.json({ listing });
  } catch (error: any) {
    console.error('Listing API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/listings/[id] - Delete a listing
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { id } = params;

    // Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify ownership
    const { data: existing } = await supabase
      .from('listings')
      .select('seller_id, status')
      .eq('id', id)
      .single();

    if (!existing || existing.seller_id !== user.id) {
      return NextResponse.json({ error: 'Not authorized to delete this listing' }, { status: 403 });
    }

    // Can't delete active or under contract listings
    if (['active', 'under_contract'].includes(existing.status)) {
      return NextResponse.json(
        { error: 'Cannot delete an active listing. Withdraw it first.' },
        { status: 400 }
      );
    }

    // Delete listing (cascade will handle related records)
    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Listing delete error:', error);
      return NextResponse.json({ error: 'Failed to delete listing' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Listing API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
