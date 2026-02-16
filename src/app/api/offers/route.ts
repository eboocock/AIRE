import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const createOfferSchema = z.object({
  listing_id: z.string().uuid(),
  offer_price: z.number().int().min(1),
  buyer_name: z.string().optional(),
  buyer_email: z.string().email().optional(),
  buyer_phone: z.string().optional(),
  buyer_agent_name: z.string().optional(),
  buyer_agent_email: z.string().email().optional(),
  earnest_money: z.number().int().optional(),
  down_payment_percent: z.number().min(0).max(100).optional(),
  financing_type: z.enum(['cash', 'conventional', 'fha', 'va', 'other']).optional(),
  pre_approval_amount: z.number().int().optional(),
  inspection_contingency: z.boolean().default(true),
  inspection_days: z.number().int().default(10),
  financing_contingency: z.boolean().default(true),
  financing_days: z.number().int().default(21),
  appraisal_contingency: z.boolean().default(true),
  closing_date: z.string().optional(),
  additional_terms: z.string().optional(),
});

// GET /api/offers - Get offers for user's listings
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get('listing_id');
    const status = searchParams.get('status');

    let query = supabase
      .from('offers')
      .select(`
        *,
        listing:listings!inner(id, street_address, city, state, list_price, seller_id)
      `)
      .eq('listing.seller_id', user.id)
      .order('submitted_at', { ascending: false });

    if (listingId) {
      query = query.eq('listing_id', listingId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data: offers, error } = await query;

    if (error) {
      console.error('Offers fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch offers' }, { status: 500 });
    }

    return NextResponse.json({ offers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/offers - Submit an offer
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Auth is optional for offers (buyers may not be registered)
    const { data: { user } } = await supabase.auth.getUser();

    const body = await request.json();
    const validationResult = createOfferSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const offerData = validationResult.data;

    // Verify listing exists and is active
    const { data: listing } = await supabase
      .from('listings')
      .select('id, status, list_price')
      .eq('id', offerData.listing_id)
      .single();

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    if (listing.status !== 'active') {
      return NextResponse.json({ error: 'Listing is not accepting offers' }, { status: 400 });
    }

    // Calculate AI strength score
    const strengthScore = calculateOfferStrength(offerData, listing.list_price);

    // Create offer
    const { data: offer, error } = await supabase
      .from('offers')
      .insert({
        ...offerData,
        buyer_id: user?.id || null,
        status: 'pending',
        ai_strength_score: strengthScore,
        ai_analysis: generateOfferAnalysis(offerData, listing.list_price, strengthScore),
        expires_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days
      })
      .select()
      .single();

    if (error) {
      console.error('Offer create error:', error);
      return NextResponse.json({ error: 'Failed to submit offer' }, { status: 500 });
    }

    // Update listing inquiry count
    try {
      await supabase.rpc('increment_listing_stat', {
        listing_id: offerData.listing_id,
        stat_name: 'inquiry_count'
      });
    } catch {
      // stat tracking is non-critical
    }

    return NextResponse.json({ offer }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Calculate offer strength (0-100)
function calculateOfferStrength(offer: any, listPrice: number): number {
  let score = 50;

  // Price relative to asking
  const priceRatio = offer.offer_price / listPrice;
  if (priceRatio >= 1.05) score += 25;
  else if (priceRatio >= 1.0) score += 20;
  else if (priceRatio >= 0.97) score += 10;
  else if (priceRatio >= 0.95) score += 5;
  else if (priceRatio < 0.90) score -= 15;

  // Financing
  if (offer.financing_type === 'cash') score += 15;
  else if (offer.financing_type === 'conventional') score += 5;

  // Contingencies
  if (!offer.inspection_contingency) score += 5;
  if (!offer.financing_contingency) score += 5;
  if (!offer.appraisal_contingency) score += 5;

  // Earnest money
  if (offer.earnest_money) {
    const earnestRatio = offer.earnest_money / offer.offer_price;
    if (earnestRatio >= 0.03) score += 5;
    else if (earnestRatio >= 0.02) score += 3;
  }

  return Math.min(100, Math.max(0, score));
}

// Generate AI analysis of offer
function generateOfferAnalysis(offer: any, listPrice: number, strengthScore: number) {
  const priceRatio = offer.offer_price / listPrice;
  const analysis: any = {
    strengthScore,
    priceAnalysis: priceRatio >= 1.0 ? 'At or above asking price' : `${Math.round((1 - priceRatio) * 100)}% below asking`,
    financingAnalysis: offer.financing_type === 'cash' ? 'Cash offer - no financing risk' : `${offer.financing_type} financing`,
    contingencies: [],
    recommendation: '',
  };

  if (offer.inspection_contingency) analysis.contingencies.push('Inspection');
  if (offer.financing_contingency) analysis.contingencies.push('Financing');
  if (offer.appraisal_contingency) analysis.contingencies.push('Appraisal');

  if (strengthScore >= 80) {
    analysis.recommendation = 'Strong offer. Consider accepting or minor counter.';
  } else if (strengthScore >= 60) {
    analysis.recommendation = 'Good offer. Room for negotiation on price or terms.';
  } else if (strengthScore >= 40) {
    analysis.recommendation = 'Average offer. Consider countering with better terms.';
  } else {
    analysis.recommendation = 'Weak offer. Significant gap from asking price.';
  }

  return analysis;
}
