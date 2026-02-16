import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// Validation schema for creating a listing
const createListingSchema = z.object({
  street_address: z.string().min(1),
  unit: z.string().optional(),
  city: z.string().min(1),
  state: z.string().length(2),
  zip_code: z.string().min(5),
  county: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  property_type: z.string().default('single_family'),
  beds: z.number().int().min(0).optional(),
  baths: z.number().min(0).optional(),
  sqft: z.number().int().min(0).optional(),
  lot_size: z.number().optional(),
  year_built: z.number().int().optional(),
  stories: z.number().int().optional(),
  garage_spaces: z.number().int().optional(),
  list_price: z.number().int().optional(),
  ai_estimated_value: z.number().int().optional(),
  ai_value_low: z.number().int().optional(),
  ai_value_high: z.number().int().optional(),
  ai_confidence_score: z.number().int().optional(),
  headline: z.string().optional(),
  description: z.string().optional(),
  ai_generated_description: z.string().optional(),
  features: z.array(z.string()).default([]),
  imported_from: z.string().optional(),
  imported_data: z.any().optional(),
});

// GET /api/listings - Get user's listings
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query params
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    let query = supabase
      .from('listings')
      .select(`
        *,
        photos:listing_photos(id, url, is_primary, sort_order),
        offers:offers(count),
        showings:showings(count)
      `)
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    const { data: listings, error } = await query;

    if (error) {
      console.error('Listings fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 });
    }

    return NextResponse.json({ listings });
  } catch (error: any) {
    console.error('Listings API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/listings - Create a new listing
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate body
    const body = await request.json();
    const validationResult = createListingSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const listingData = validationResult.data;

    // Create listing
    const { data: listing, error } = await supabase
      .from('listings')
      .insert({
        ...listingData,
        seller_id: user.id,
        status: 'draft',
      })
      .select()
      .single();

    if (error) {
      console.error('Listing create error:', error);
      return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 });
    }

    return NextResponse.json({ listing }, { status: 201 });
  } catch (error: any) {
    console.error('Listings API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
