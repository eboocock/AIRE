import { NextRequest, NextResponse } from 'next/server';

const RENTCAST_API_KEY = process.env.RENTCAST_API_KEY;

export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get('address');

  if (!address || address.trim().length < 5) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 });
  }

  if (!RENTCAST_API_KEY) {
    return NextResponse.json({
      error: 'Property lookup not configured',
      data: null
    }, { status: 200 });
  }

  try {
    // RentCast Property Records API
    const url = `https://api.rentcast.io/v1/properties?address=${encodeURIComponent(address.trim())}`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'X-Api-Key': RENTCAST_API_KEY,
      },
    });

    if (!response.ok) {
      console.log('[RentCast] API error:', response.status);
      return NextResponse.json({
        error: 'Property not found',
        data: null
      }, { status: 200 });
    }

    const results = await response.json();

    if (!results || results.length === 0) {
      return NextResponse.json({
        error: 'Property not found',
        data: null
      }, { status: 200 });
    }

    const property = results[0];

    return NextResponse.json({
      data: {
        year_built: property.yearBuilt || null,
        owner_name: property.ownerName || null,
        beds: property.bedrooms || null,
        baths: property.bathrooms || null,
        sqft: property.squareFootage || null,
        city: property.city || null,
        state: property.state || null,
        zip_code: property.zipCode || null,
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
