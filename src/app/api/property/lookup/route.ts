import { NextRequest, NextResponse } from 'next/server';

const ATTOM_API_KEY = process.env.ATTOM_API_KEY;

// Parse address into components for ATTOM API
function parseAddress(address: string): { address1: string; address2: string } | null {
  // Expected format: "123 Main St, Seattle, WA 98101"
  const parts = address.split(',').map(p => p.trim());
  if (parts.length < 2) return null;

  const address1 = parts[0]; // Street address
  const address2 = parts.slice(1).join(', '); // City, State ZIP

  return { address1, address2 };
}

export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get('address');

  if (!address || address.trim().length < 5) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 });
  }

  if (!ATTOM_API_KEY) {
    return NextResponse.json({
      error: 'Property lookup not configured',
      data: null
    }, { status: 200 });
  }

  const parsed = parseAddress(address);
  if (!parsed) {
    return NextResponse.json({
      error: 'Invalid address format',
      data: null
    }, { status: 200 });
  }

  try {
    // ATTOM Property API - Basic Profile endpoint
    const url = `https://api.gateway.attomdata.com/propertyapi/v1.0.0/property/basicprofile?address1=${encodeURIComponent(parsed.address1)}&address2=${encodeURIComponent(parsed.address2)}`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'apikey': ATTOM_API_KEY,
      },
    });

    if (!response.ok) {
      console.log('[ATTOM] API error:', response.status);
      return NextResponse.json({
        error: 'Property not found',
        data: null
      }, { status: 200 });
    }

    const result = await response.json();

    if (!result.property || result.property.length === 0) {
      return NextResponse.json({
        error: 'Property not found',
        data: null
      }, { status: 200 });
    }

    const property = result.property[0];
    const building = property.building || {};
    const summary = building.summary || {};
    const owner = property.assessment?.owner || {};

    return NextResponse.json({
      data: {
        year_built: summary.yearBuilt || null,
        owner_name: owner.owner1FullName || owner.corporateIndicator || null,
        beds: summary.bedrooms || null,
        baths: summary.bathrooms || null,
        sqft: building.size?.livingSize || building.size?.universalSize || null,
        city: property.address?.locality || null,
        state: property.address?.countrySubd || null,
        zip_code: property.address?.postal1 || null,
      }
    });
  } catch (error) {
    console.error('[Property Lookup] Error:', error);
    return NextResponse.json({
      error: 'Lookup failed',
      data: null
    }, { status: 200 });
  }
}
