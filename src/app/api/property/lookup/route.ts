import { NextRequest, NextResponse } from 'next/server';

const ESTATED_API_KEY = process.env.ESTATED_API_KEY;

interface EstatedProperty {
  address?: {
    street_address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
  };
  structure?: {
    year_built?: number;
    beds_count?: number;
    baths?: number;
    total_area_sq_ft?: number;
  };
  owner?: {
    name?: string;
  };
}

export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get('address');

  if (!address || address.trim().length < 5) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 });
  }

  if (!ESTATED_API_KEY) {
    return NextResponse.json({
      error: 'Property lookup not configured',
      data: null
    }, { status: 200 });
  }

  try {
    const url = `https://apis.estated.com/v4/property?token=${ESTATED_API_KEY}&combined_address=${encodeURIComponent(address)}`;

    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      return NextResponse.json({
        error: 'Property not found',
        data: null
      }, { status: 200 });
    }

    const result = await response.json();

    if (result.error || !result.data) {
      return NextResponse.json({
        error: 'Property not found',
        data: null
      }, { status: 200 });
    }

    const property = result.data as EstatedProperty;

    return NextResponse.json({
      data: {
        year_built: property.structure?.year_built || null,
        owner_name: property.owner?.name || null,
        beds: property.structure?.beds_count || null,
        baths: property.structure?.baths || null,
        sqft: property.structure?.total_area_sq_ft || null,
        city: property.address?.city || null,
        state: property.address?.state || null,
        zip_code: property.address?.zip_code || null,
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
