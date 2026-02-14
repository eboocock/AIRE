// AI Analysis API - Synthesizes all property data into actionable insights
// Combines property data, comparables, and market intelligence

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// Generate AI listing description using Claude or GPT
async function generateListingDescription(propertyData) {
    const prompt = `Write a compelling real estate listing description for this property. Be professional and highlight key selling points. Do not include the price.

Property Details:
- Address: ${propertyData.address}
- Bedrooms: ${propertyData.beds}
- Bathrooms: ${propertyData.baths}
- Square Feet: ${propertyData.sqft?.toLocaleString()}
- Year Built: ${propertyData.yearBuilt}
- Lot Size: ${propertyData.lotSize}
- Property Type: ${propertyData.propertyType || 'Single Family Home'}
- Location: ${propertyData.city}, ${propertyData.state}
${propertyData.features?.length ? `- Features: ${propertyData.features.join(', ')}` : ''}

Write 3-4 paragraphs that would appeal to buyers. Focus on lifestyle, location benefits, and unique features.`;

    // Try Claude first
    if (ANTHROPIC_API_KEY) {
        try {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': ANTHROPIC_API_KEY,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: 'claude-3-haiku-20240307',
                    max_tokens: 1024,
                    messages: [{ role: 'user', content: prompt }]
                })
            });

            if (response.ok) {
                const data = await response.json();
                return data.content[0].text;
            }
        } catch (err) {
            console.error('Claude API error:', err);
        }
    }

    // Fall back to OpenAI
    if (OPENAI_API_KEY) {
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: prompt }],
                    max_tokens: 1024
                })
            });

            if (response.ok) {
                const data = await response.json();
                return data.choices[0].message.content;
            }
        } catch (err) {
            console.error('OpenAI API error:', err);
        }
    }

    // Return template if no AI available
    return generateTemplateDescription(propertyData);
}

// Template-based description fallback
function generateTemplateDescription(propertyData) {
    const city = propertyData.city || 'this desirable area';
    const beds = propertyData.beds || 3;
    const baths = propertyData.baths || 2;
    const sqft = propertyData.sqft?.toLocaleString() || '2,000';
    const yearBuilt = propertyData.yearBuilt || 'recently';

    return `Welcome to this exceptional ${beds}-bedroom, ${baths}-bathroom home in ${city}. With ${sqft} square feet of thoughtfully designed living space, this residence offers the perfect blend of comfort and style.

Built in ${yearBuilt}, this home features an open floor plan that flows seamlessly from room to room. The spacious kitchen is perfect for both everyday meals and entertaining, while the living areas provide ample room for relaxation and family gatherings.

The primary suite serves as a private retreat, complemented by additional bedrooms that offer flexibility for family, guests, or home office needs. Outside, the well-maintained grounds provide outdoor living opportunities in a peaceful setting.

Located in a sought-after neighborhood with excellent schools and convenient access to shopping, dining, and major commuting routes, this home represents an outstanding opportunity. Schedule your private showing today.`;
}

// Calculate AI-powered valuation with confidence score
function calculateAIValuation(propertyData, comparables, marketData) {
    const results = {
        estimatedValue: propertyData.estimatedValue || 0,
        valueLow: 0,
        valueHigh: 0,
        confidence: 0,
        methodology: [],
        factors: []
    };

    let estimates = [];
    let weights = [];

    // Factor 1: Direct property estimate (if available)
    if (propertyData.estimatedValue) {
        estimates.push(propertyData.estimatedValue);
        weights.push(0.25);
        results.methodology.push({
            source: propertyData.source || 'API',
            value: propertyData.estimatedValue,
            weight: '25%'
        });
    }

    // Factor 2: Zestimate (if available)
    if (propertyData.zestimate) {
        estimates.push(propertyData.zestimate);
        weights.push(0.25);
        results.methodology.push({
            source: 'Zillow Zestimate',
            value: propertyData.zestimate,
            weight: '25%'
        });
    }

    // Factor 3: Comparable sales analysis
    if (comparables && comparables.length > 0) {
        const validComps = comparables.filter(c => c.price && c.sqft);

        if (validComps.length > 0) {
            // Calculate price per sqft from comps
            const avgPricePerSqft = validComps.reduce((sum, c) => sum + (c.price / c.sqft), 0) / validComps.length;

            // Apply to subject property
            const compBasedValue = Math.round(avgPricePerSqft * (propertyData.sqft || 2000));
            estimates.push(compBasedValue);
            weights.push(0.35);

            results.methodology.push({
                source: `Comparable Analysis (${validComps.length} comps)`,
                value: compBasedValue,
                avgPricePerSqft: Math.round(avgPricePerSqft),
                weight: '35%'
            });
        }
    }

    // Factor 4: Tax assessed value (typically conservative)
    if (propertyData.taxAssessedValue) {
        // Tax assessments are often 80-90% of market value
        const adjustedTaxValue = Math.round(propertyData.taxAssessedValue * 1.15);
        estimates.push(adjustedTaxValue);
        weights.push(0.15);

        results.methodology.push({
            source: 'Tax Assessment (adjusted)',
            value: adjustedTaxValue,
            weight: '15%'
        });
    }

    // Calculate weighted average
    if (estimates.length > 0) {
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        const normalizedWeights = weights.map(w => w / totalWeight);

        results.estimatedValue = Math.round(
            estimates.reduce((sum, est, i) => sum + (est * normalizedWeights[i]), 0) / 1000
        ) * 1000;

        // Calculate range (±5% typical)
        results.valueLow = Math.round(results.estimatedValue * 0.95 / 1000) * 1000;
        results.valueHigh = Math.round(results.estimatedValue * 1.05 / 1000) * 1000;

        // Confidence based on data quality
        let confidence = 50;
        if (estimates.length >= 3) confidence += 20;
        if (estimates.length >= 2) confidence += 10;
        if (comparables && comparables.length >= 3) confidence += 10;
        if (propertyData.zestimate) confidence += 5;
        if (propertyData.taxAssessedValue) confidence += 5;

        results.confidence = Math.min(confidence, 98);
    }

    // Add value factors
    if (marketData) {
        if (marketData.marketTemperature?.score >= 65) {
            results.factors.push({
                factor: 'Hot Market',
                impact: '+2-5%',
                description: 'Strong buyer demand may push prices higher'
            });
        }

        if (marketData.avgSchoolRating >= 8) {
            results.factors.push({
                factor: 'Excellent Schools',
                impact: '+3-7%',
                description: 'Top-rated school district commands premium'
            });
        }

        if (marketData.walkScore >= 70) {
            results.factors.push({
                factor: 'High Walkability',
                impact: '+1-3%',
                description: 'Walkable location increases desirability'
            });
        }
    }

    return results;
}

// Generate improvement recommendations
function generateImprovements(propertyData, marketData) {
    const improvements = [];
    const baseValue = propertyData.estimatedValue || 500000;

    // Standard improvements with ROI calculations
    const standardImprovements = [
        {
            item: 'Professional photography & virtual tour',
            cost: 300,
            addedValue: Math.round(baseValue * 0.02),
            roi: 'Essential',
            priority: 1
        },
        {
            item: 'Pre-listing deep clean',
            cost: 400,
            addedValue: Math.round(baseValue * 0.01),
            priority: 2
        },
        {
            item: 'Professional staging consultation',
            cost: 500,
            addedValue: Math.round(baseValue * 0.03),
            priority: 3
        },
        {
            item: 'Landscape refresh & curb appeal',
            cost: 1500,
            addedValue: Math.round(baseValue * 0.02),
            priority: 4
        },
        {
            item: 'Interior paint touch-ups',
            cost: 2000,
            addedValue: Math.round(baseValue * 0.025),
            priority: 5
        }
    ];

    // Calculate ROI for each
    for (const imp of standardImprovements) {
        const roiPercent = Math.round((imp.addedValue - imp.cost) / imp.cost * 100);
        improvements.push({
            ...imp,
            roi: imp.roi || `${roiPercent}%`
        });
    }

    return improvements.sort((a, b) => a.priority - b.priority);
}

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        // Accept POST with full data or GET for simple queries
        let propertyData, comparables, marketData;

        if (event.httpMethod === 'POST') {
            const body = JSON.parse(event.body || '{}');
            propertyData = body.propertyData;
            comparables = body.comparables;
            marketData = body.marketData;
        } else {
            const params = event.queryStringParameters || {};
            // For GET, we'd need to fetch the data - but POST is preferred
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'POST request with property data required' })
            };
        }

        if (!propertyData) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'propertyData is required' })
            };
        }

        // Generate AI analysis
        const [listingDescription, valuation] = await Promise.all([
            generateListingDescription(propertyData),
            Promise.resolve(calculateAIValuation(propertyData, comparables, marketData))
        ]);

        const improvements = generateImprovements(propertyData, marketData);

        // Calculate savings vs traditional agent
        const traditionalCommission = Math.round(valuation.estimatedValue * 0.06);
        const aireFee = 499;
        const savings = traditionalCommission - aireFee;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                valuation,
                listingDescription,
                improvements,
                savings: {
                    traditionalCommission,
                    aireFee,
                    totalSavings: savings
                },
                generatedAt: new Date().toISOString()
            })
        };

    } catch (error) {
        console.error('AI Analysis error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error', message: error.message })
        };
    }
};
