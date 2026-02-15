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
  const { status, confirmed_date, confirmed_time_start, confirmed_time_end, lockbox_code, access_instructions } = body;

  // Fetch showing and verify ownership
  const { data: showing, error: showingError } = await supabase
    .from('showings')
    .select('*, listing:listings!listing_id(seller_id)')
    .eq('id', params.id)
    .single();

  if (showingError || !showing) {
    return NextResponse.json({ error: 'Showing not found' }, { status: 404 });
  }

  const listing = showing.listing as any;
  if (listing.seller_id !== user.id) {
    return NextResponse.json({ error: 'Only the seller can manage showings' }, { status: 403 });
  }

  const updates: Record<string, any> = {};
  if (status) updates.status = status;
  if (confirmed_date) updates.confirmed_date = confirmed_date;
  if (confirmed_time_start) updates.confirmed_time_start = confirmed_time_start;
  if (confirmed_time_end) updates.confirmed_time_end = confirmed_time_end;
  if (lockbox_code) updates.lockbox_code = lockbox_code;
  if (access_instructions) updates.access_instructions = access_instructions;

  const { data: updatedShowing, error: updateError } = await supabase
    .from('showings')
    .update(updates)
    .eq('id', params.id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ error: 'Failed to update showing' }, { status: 500 });
  }

  return NextResponse.json(updatedShowing);
}
