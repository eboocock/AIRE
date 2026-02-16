// Property API - Integrates with real estate data providers

interface PropertyDetails {
  latitude?: number;
  longitude?: number;
  city?: string;
  state?: string;
  zipCode?: string;
}

interface AnalysisResult {
  id: string;
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
  estimated_value: number | null;
  value_low: number | null;
  value_high: number | null;
  confidence_score: number | null;
  price_per_sqft: number | null;
  property_data: any;
  comparables: any;
  market_data: any;
  listing_description: string | null;
  improvements: any;
  data_sources: any;
  expires_at: string;
  created_at: string;
}

export async function analyzeProperty(
  address: string,
  details: PropertyDetails | null,
  onProgress: (step: number) => void
): Promise<AnalysisResult> {
  onProgress(1);

  try {
    // Call our API route
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, details }),
    });

    if (!response.ok) {
      throw new Error('Analysis failed');
    }

    const result = await response.json();

    // Simulate progress for UX
    for (let i = 2; i <= 7; i++) {
      await new Promise((r) => setTimeout(r, 300));
      onProgress(i);
    }

    return result;
  } catch (error) {
    // Generate demo data as fallback
    return generateDemoAnalysis(address, details);
  }
}

function generateDemoAnalysis(
  address: string,
  details: PropertyDetails | null
): AnalysisResult {
  const addrLower = address.toLowerCase();
  let pricePerSqft = 450;
  let neighborhood = details?.city || 'your area';

  // Location-specific adjustments
  if (addrLower.includes('sammamish') || addrLower.includes('98075')) {
    pricePerSqft = 585;
    neighborhood = 'Sammamish';
  } else if (addrLower.includes('bellevue') || addrLower.includes('98004')) {
    pricePerSqft = 750;
    neighborhood = 'Bellevue';
  } else if (addrLower.includes('seattle')) {
    pricePerSqft = 520;
    neighborhood = 'Seattle Metro';
  } else if (addrLower.includes('kirkland')) {
    pricePerSqft = 620;
    neighborhood = 'Kirkland';
  } else if (addrLower.includes('redmond')) {
    pricePerSqft = 560;
    neighborhood = 'Redmond';
  }

  const sqft = 2450;
  const estimatedValue = Math.round((sqft * pricePerSqft) / 1000) * 1000;

  return {
    id: crypto.randomUUID(),
    street_address: address,
    city: neighborhood,
    state: details?.state || 'WA',
    zip_code: details?.zipCode || '98000',
    estimated_value: estimatedValue,
    value_low: Math.round(estimatedValue * 0.95 / 1000) * 1000,
    value_high: Math.round(estimatedValue * 1.08 / 1000) * 1000,
    confidence_score: 75,
    price_per_sqft: pricePerSqft,
    property_data: {
      beds: 4,
      baths: 2.5,
      sqft,
      yearBuilt: 2005,
      lotSize: 0.25,
    },
    comparables: [
      { address: '123 Nearby St', price: Math.round(estimatedValue * 0.97 / 1000) * 1000, sqft: sqft - 100 },
      { address: '456 Similar Ave', price: Math.round(estimatedValue * 1.02 / 1000) * 1000, sqft: sqft + 50 },
      { address: '789 Comparable Ln', price: Math.round(estimatedValue * 0.95 / 1000) * 1000, sqft: sqft - 200 },
    ],
    market_data: {
      marketTemp: 'warm',
      daysOnMarket: 21,
      demandLevel: 'high',
      bestMonth: 'April-June',
      schoolRating: 8,
      walkScore: 65,
    },
    listing_description: `This is a sample listing description for a home in ${neighborhood}. When you create your listing, AIREA's AI will generate a custom description based on your property's actual features, photos, and details.\n\nSample: Welcome to this 4-bedroom, 2.5-bath home in ${neighborhood}. This 2,450 sq ft residence offers modern comfort with an open floor plan, updated kitchen, and a top-rated school district location.\n\nNote: This is demo data. Sign up to get a real AI-generated description for your property.`,
    improvements: [
      { item: 'Professional photography & staging', cost: 800, addedValue: Math.round(estimatedValue * 0.03), roi: '650%' },
      { item: 'Fresh interior paint', cost: 2500, addedValue: Math.round(estimatedValue * 0.02), roi: '220%' },
      { item: 'Landscape refresh', cost: 1500, addedValue: Math.round(estimatedValue * 0.015), roi: '300%' },
    ],
    data_sources: ['Demo Mode — sign up for real data'],
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
  };
}
