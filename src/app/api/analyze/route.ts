import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const ESTATED_API_KEY = process.env.ESTATED_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

interface PropertyDetails {
  city?: string;
  state?: string;
  zipCode?: string;
}

interface EstatedProperty {
  address?: {
    street_address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    county?: string;
  };
  parcel?: {
    area_sq_ft?: number;
    county_name?: string;
  };
  structure?: {
    beds_count?: number;
    baths?: number;
    total_area_sq_ft?: number;
    year_built?: number;
    stories?: number;
    rooms_count?: number;
    architecture_type?: string;
  };
  valuation?: {
    value?: number;
    low?: number;
    high?: number;
    date?: string;
  };
  taxes?: {
    year?: number;
    amount?: number;
    assessment_year?: number;
    market_value?: number;
  }[];
  owner?: {
    name?: string;
  };
  deeds?: {
    sale_price?: number;
    sale_date?: string;
  }[];
}

// Fetch property data from Estated API
async function fetchPropertyData(address: string): Promise<EstatedProperty | null> {
  if (!ESTATED_API_KEY) {
    console.log('[Estated] No API key configured');
    return null;
  }

  try {
    const url = `https://apis.estated.com/v4/property?token=${ESTATED_API_KEY}&combined_address=${encodeURIComponent(address)}`;
    console.log('[Estated] Fetching property data');

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.log('[Estated] API error:', response.status);
      return null;
    }

    const data = await response.json();

    if (data.error) {
      console.log('[Estated] API returned error:', data.error);
      return null;
    }

    console.log('[Estated] Property data received');
    return data.data as EstatedProperty;
  } catch (error) {
    console.error('[Estated] Fetch error:', error);
    return null;
  }
}

// Generate AI listing description using Claude
async function generateListingDescription(propertyData: EstatedProperty, address: string): Promise<string | null> {
  if (!ANTHROPIC_API_KEY) {
    console.log('[Claude] No API key configured');
    return null;
  }

  const structure = propertyData.structure || {};
  const addr = propertyData.address || {};

  const prompt = `Write a compelling real estate listing description for this property. Be professional and highlight key selling points. Keep it to 3 paragraphs.

Property Details:
- Address: ${address}
- Bedrooms: ${structure.beds_count || 'Unknown'}
- Bathrooms: ${structure.baths || 'Unknown'}
- Square Feet: ${structure.total_area_sq_ft?.toLocaleString() || 'Unknown'}
- Year Built: ${structure.year_built || 'Unknown'}
- Stories: ${structure.stories || 'Unknown'}
- Architecture: ${structure.architecture_type || 'Traditional'}
- Location: ${addr.city || 'Unknown'}, ${addr.state || 'WA'}

Write an engaging description that would appeal to buyers. Focus on the home's features and potential. Do not mention specific prices.`;

  try {
    console.log('[Claude] Generating listing description');
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

    if (!response.ok) {
      console.log('[Claude] API error:', response.status);
      return null;
    }

    const data = await response.json();
    console.log('[Claude] Description generated');
    return data.content?.[0]?.text || null;
  } catch (error) {
    console.error('[Claude] Error:', error);
    return null;
  }
}

// Parse address string to extract city, state, zip
function parseAddress(address: string): { city: string; state: string; zipCode: string } {
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

  // Adjust pricing based on known areas
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
    // Parse request body
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

    // Check for authenticated user (optional)
    let user = null;
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      try {
        const supabase = await createClient();
        const { data } = await supabase.auth.getUser();
        user = data?.user;
      } catch {
        // Supabase auth check failed, continue
      }
    }

    // Fetch real property data from Estated
    const propertyData = await fetchPropertyData(address);

    if (propertyData && propertyData.structure) {
      console.log('[Analyze API] Real property data available');

      const structure = propertyData.structure;
      const valuation = propertyData.valuation;
      const addr = propertyData.address || {};
      const parcel = propertyData.parcel || {};

      // Get the most recent sale for comparables context
      const lastSale = propertyData.deeds?.[0];

      // Calculate estimated value
      let estimatedValue = valuation?.value || 0;
      if (!estimatedValue && structure.total_area_sq_ft) {
        // Fallback: estimate based on area average
        estimatedValue = structure.total_area_sq_ft * 450;
      }

      // Generate AI description
      const description = await generateListingDescription(propertyData, address);

      const result = {
        street_address: address,
        city: addr.city || parseAddress(address).city,
        state: addr.state || 'WA',
        zip_code: addr.zip_code || parseAddress(address).zipCode,
        county: addr.county || parcel.county_name,
        estimated_value: estimatedValue,
        value_low: valuation?.low || Math.round(estimatedValue * 0.95 / 1000) * 1000,
        value_high: valuation?.high || Math.round(estimatedValue * 1.05 / 1000) * 1000,
        confidence_score: valuation?.value ? 92 : 75,
        price_per_sqft: structure.total_area_sq_ft
          ? Math.round(estimatedValue / structure.total_area_sq_ft)
          : 450,
        property_data: {
          beds: structure.beds_count || null,
          baths: structure.baths || null,
          sqft: structure.total_area_sq_ft || null,
          yearBuilt: structure.year_built || null,
          stories: structure.stories || null,
          lotSize: parcel.area_sq_ft ? Math.round(parcel.area_sq_ft / 43560 * 100) / 100 : null,
          architectureType: structure.architecture_type || null,
          roomsCount: structure.rooms_count || null,
        },
        owner: propertyData.owner?.name || null,
        last_sale: lastSale ? {
          price: lastSale.sale_price,
          date: lastSale.sale_date,
        } : null,
        taxes: propertyData.taxes?.[0] ? {
          year: propertyData.taxes[0].year,
          amount: propertyData.taxes[0].amount,
          assessed_value: propertyData.taxes[0].market_value,
        } : null,
        market_data: {
          marketTemp: 'warm',
          daysOnMarket: 21,
          schoolRating: 8,
          walkScore: 65,
        },
        listing_description: description || generateDemoData(address, details).listing_description,
        improvements: [
          {
            item: 'Professional photography & staging',
            cost: 800,
            addedValue: Math.round(estimatedValue * 0.03),
            roi: '650%'
          },
          {
            item: 'Fresh interior paint',
            cost: 2500,
            addedValue: Math.round(estimatedValue * 0.02),
            roi: '220%'
          },
        ],
        data_sources: ['Estated'],
        is_demo: false,
      };

      // Cache in Supabase (optional)
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
            market_data: result.market_data,
            listing_description: result.listing_description,
            improvements: result.improvements,
            data_sources: result.data_sources,
          });
        } catch {
          // Caching failed, continue
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
