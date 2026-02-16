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

// Generate demo data fallback
function generateDemoData(address: string, details: PropertyDetails | null) {
  const addrLower = address.toLowerCase();
  let pricePerSqft = 450;
  let city = details?.city || 'Unknown';

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
    state: details?.state || 'WA',
    zip_code: details?.zipCode || '98000',
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
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Rate limiting for unauthenticated users
    if (!user) {
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                 request.headers.get('x-real-ip') ||
                 'unknown';

      const now = Date.now();
      const rateLimit = rateLimitMap.get(ip);

      if (rateLimit) {
        if (now < rateLimit.resetAt) {
          if (rateLimit.count >= MAX_REQUESTS_UNAUTHENTICATED) {
            return NextResponse.json(
              {
                error: 'Rate limit exceeded',
                message: 'Please sign up for unlimited AI property analysis',
                retryAfter: Math.ceil((rateLimit.resetAt - now) / 1000),
              },
              { status: 429 }
            );
          }
          rateLimit.count++;
        } else {
          rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
        }
      } else {
        rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
      }
    }

    const { address, details } = await request.json();

    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

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

      // Cache in Supabase
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

      return NextResponse.json(result);
    }

    // Fall back to demo data
    return NextResponse.json(generateDemoData(address, details));
  } catch (error: any) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Analysis failed', message: error.message },
      { status: 500 }
    );
  }
}
