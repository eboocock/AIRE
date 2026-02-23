import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/disclosures/sessions - list user's sessions
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('disclosure_sessions')
    .select(`
      *,
      form:disclosure_forms(form_name, form_code, state)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/disclosures/sessions - create a new disclosure session
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { form_code, state, property_address, listing_id, property_data, seller_name, seller_email } = await request.json();

  if (!form_code || !state || !property_address) {
    return NextResponse.json({ error: 'form_code, state, and property_address are required' }, { status: 400 });
  }

  // Look up the form
  const { data: form } = await supabase
    .from('disclosure_forms')
    .select('id')
    .eq('form_code', form_code)
    .eq('is_active', true)
    .single();

  if (!form) return NextResponse.json({ error: 'Form not found' }, { status: 404 });

  const { data: session, error } = await supabase
    .from('disclosure_sessions')
    .insert({
      user_id: user.id,
      form_id: form.id,
      listing_id: listing_id || null,
      property_address,
      property_data: property_data || null,
      seller_name: seller_name || null,
      seller_email: seller_email || null,
      status: 'in_progress',
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(session, { status: 201 });
}
