import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// Simple in-memory rate limiting for unauthenticated users
// In production, use Redis or similar
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_UNAUTHENTICATED = 3; // 3 requests per hour for unauthenticated

interface PropertyDetails {
  latitude?: number;
  longitude?: number;
  city?: string;
  state?: string;
  zipCode?: string;
}

// Fetch property data from Realty Mole API
async function fetchPropertyData(address: string) {
  if (!RAPIDAPI_KEY) return null;

  try {
    const response = await fetch(
      `https://realty-mole-property-api.p.rapidapi.com/properties?address=${encodeURIComponent(address)}`,
      {
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'realty-mole-property-api.p.rapidapi.com',
        },
      }
    );

    if (!response.ok) return null;
    const data = await response.json();
    return data?.[0] || null;
  } catch {
    return null;
  }
}

// Fetch comparable sales
async function fetchComparables(lat: number, lon: number) {
  if (!RAPIDAPI_KEY) return [];

  try {
    const response = await fetch(
      `https://realty-mole-property-api.p.rapidapi.com/saleRecords?latitude=${lat}&longitude=${lon}&radius=1&limit=5`,
      {
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'realty-mole-property-api.p.rapidapi.com',
        },
      }
    );

    if (!response.ok) return [];
    return await response.json();
  } catch {
    return [];
  }
}

// Generate AI listing description
async function generateListingDescription(propertyData: any) {
  if (!ANTHROPIC_API_KEY) return null;

  const prompt = `Write a compelling real estate listing description for this property. Be professional and highlight key selling points. 3-4 paragraphs.

Property: ${propertyData.beds || 4} bed, ${propertyData.baths || 2.5} bath, ${propertyData.sqft?.toLocaleString() || '2,500'} sqft
Location: ${propertyData.city || 'Unknown'}, ${propertyData.state || 'WA'}
Year Built: ${propertyData.yearBuilt || 'Recently'}
Features: ${propertyData.features?.join(', ') || 'Modern finishes'}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data.content?.[0]?.text || null;
  } catch {
    return null;
  }
}

// Parse address string to extract city, state, zip
function parseAddress(address: string): { city: string; state: string; zipCode: string } {
  // Expected format: "123 Main St, City, ST 12345"
  const parts = address.split(',').map(p => p.trim());
  let city = 'Unknown';
  let state = 'WA';
  let zipCode = '98000';

  if (parts.length >= 2) {
    city = parts[1] || city;
  }
  if (parts.length >= 3) {
    const stateZip = parts[2].trim();
    const match = stateZip.match(/^([A-Z]{2})\s*(\d{5})?/i);
    if (match) {
      state = match[1].toUpperCase();
      if (match[2]) zipCode = match[2];
    }
  }

  return { city, state, zipCode };
}

// Generate demo data fallback
function generateDemoData(address: string, details: PropertyDetails | null) {
  const addrLower = address.toLowerCase();
  const parsed = parseAddress(address);
  let pricePerSqft = 450;
  let city = parsed.city;
  const state = details?.state || parsed.state;
  const zipCode = details?.zipCode || parsed.zipCode;

  if (addrLower.includes('sammamish') || addrLower.includes('98075')) {
    pricePerSqft = 585;
    city = 'Sammamish';
  } else if (addrLower.includes('bellevue') || addrLower.includes('98004')) {
    pricePerSqft = 750;
    city = 'Bellevue';
  } else if (addrLower.includes('seattle')) {
    pricePerSqft = 520;
    city = 'Seattle';
  } else if (addrLower.includes('kirkland')) {
    pricePerSqft = 620;
    city = 'Kirkland';
  } else if (addrLower.includes('redmond')) {
    pricePerSqft = 560;
    city = 'Redmond';
  }

  const sqft = 2450;
  const estimatedValue = Math.round((sqft * pricePerSqft) / 1000) * 1000;

  return {
    street_address: address,
    city,
    state,
    zip_code: zipCode,
    estimated_value: estimatedValue,
    value_low: Math.round(estimatedValue * 0.95 / 1000) * 1000,
    value_high: Math.round(estimatedValue * 1.08 / 1000) * 1000,
    confidence_score: 75,
    price_per_sqft: pricePerSqft,
    property_data: { beds: 4, baths: 2.5, sqft, yearBuilt: 2005, lotSize: 0.25 },
    comparables: [
      { address: '123 Nearby St', price: Math.round(estimatedValue * 0.97 / 1000) * 1000, sqft: sqft - 100 },
      { address: '456 Similar Ave', price: Math.round(estimatedValue * 1.02 / 1000) * 1000, sqft: sqft + 50 },
      { address: '789 Comparable Ln', price: Math.round(estimatedValue * 0.95 / 1000) * 1000, sqft: sqft - 200 },
    ],
    market_data: { marketTemp: 'warm', daysOnMarket: 21, schoolRating: 8, walkScore: 65 },
    listing_description: `Welcome to this stunning 4-bedroom, 2.5-bath home in ${city}. This 2,450 sq ft residence offers modern comfort and timeless elegance.\n\nThe open floor plan features hardwood floors and natural light. The chef's kitchen boasts granite countertops and stainless appliances.\n\nLocated in a top-rated school district with easy access to tech hubs and dining.`,
    improvements: [
      { item: 'Professional photography & staging', cost: 800, addedValue: Math.round(estimatedValue * 0.03), roi: '650%' },
      { item: 'Fresh interior paint', cost: 2500, addedValue: Math.round(estimatedValue * 0.02), roi: '220%' },
    ],
    data_sources: ['Demo Mode'],
    is_demo: true,
  };
}

export async function POST(request: NextRequest) {
  console.log('[Analyze API] Request received');

  try {
    // Parse request body first
    let body;
    try {
      body = await request.json();
      console.log('[Analyze API] Body parsed:', { address: body.address });
    } catch (parseError) {
      console.error('[Analyze API] Failed to parse body:', parseError);
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const address = body.address;
    const details = body.details || body.propertyDetails;

    if (!address || typeof address !== 'string' || address.trim().length === 0) {
      console.log('[Analyze API] Invalid address:', address);
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    // Check for authenticated user (skip if Supabase not configured)
    let user = null;
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      try {
        const supabase = await createClient();
        const { data } = await supabase.auth.getUser();
        user = data?.user;
      } catch {
        // Supabase auth check failed, continue as unauthenticated
      }
    }

    // Rate limiting for unauthenticated users (disabled for now to debug)
    // TODO: Re-enable after testing

    // Try to fetch real data
    const propertyData = await fetchPropertyData(address);

    if (propertyData) {
      // Real data available
      const [comps, description] = await Promise.all([
        fetchComparables(propertyData.latitude, propertyData.longitude),
        generateListingDescription(propertyData),
      ]);

      const estimatedValue = propertyData.price || propertyData.estimatedValue ||
        (propertyData.squareFootage * 500);

      const result = {
        street_address: address,
        city: propertyData.city,
        state: propertyData.state,
        zip_code: propertyData.zipCode,
        estimated_value: estimatedValue,
        value_low: Math.round(estimatedValue * 0.95 / 1000) * 1000,
        value_high: Math.round(estimatedValue * 1.05 / 1000) * 1000,
        confidence_score: 88,
        price_per_sqft: propertyData.squareFootage
          ? Math.round(estimatedValue / propertyData.squareFootage)
          : 500,
        property_data: {
          beds: propertyData.bedrooms,
          baths: propertyData.bathrooms,
          sqft: propertyData.squareFootage,
          yearBuilt: propertyData.yearBuilt,
          lotSize: propertyData.lotSize,
          propertyType: propertyData.propertyType,
        },
        comparables: comps.slice(0, 5).map((c: any) => ({
          address: c.formattedAddress || c.addressLine1,
          price: c.price || c.lastSalePrice,
          sqft: c.squareFootage,
          saleDate: c.lastSaleDate,
        })),
        market_data: {
          marketTemp: 'warm',
          daysOnMarket: 21,
          schoolRating: 8,
          walkScore: 65,
        },
        listing_description: description || generateDemoData(address, details).listing_description,
        improvements: generateDemoData(address, details).improvements,
        data_sources: ['Realty Mole'],
        is_demo: false,
      };

      // Cache in Supabase (if configured)
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        try {
          const supabase = await createClient();
          await supabase.from('ai_valuations').insert({
            street_address: result.street_address,
            city: result.city,
            state: result.state,
            zip_code: result.zip_code,
            estimated_value: result.estimated_value,
            value_low: result.value_low,
            value_high: result.value_high,
            confidence_score: result.confidence_score,
            price_per_sqft: result.price_per_sqft,
            property_data: result.property_data,
            comparables: result.comparables,
            market_data: result.market_data,
            listing_description: result.listing_description,
            improvements: result.improvements,
            data_sources: result.data_sources,
          });
        } catch {
          // Caching failed, continue anyway
        }
      }

      return NextResponse.json(result);
    }

    // Fall back to demo data
    console.log('[Analyze API] Using demo data for address:', address);
    const demoData = generateDemoData(address, details);
    console.log('[Analyze API] Demo data generated:', { estimated_value: demoData.estimated_value });
    return NextResponse.json(demoData);
  } catch (error: any) {
    console.error('[Analyze API] Error:', error);
    return NextResponse.json(
      { error: 'Analysis failed', message: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
