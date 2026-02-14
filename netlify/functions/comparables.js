// Comparables API - Fetches real comparable sales data
// Uses Realty Mole and Zillow APIs for comp data

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

// Fetch comparables from Realty Mole
async function fetchRealtyMoleComps(latitude, longitude, radius = 1) {
    const response = await fetch(
        `https://realty-mole-property-api.p.rapidapi.com/saleListings?latitude=${latitude}&longitude=${longitude}&radius=${radius}&limit=10`,
        {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'realty-mole-property-api.p.rapidapi.com'
            }
        }
    );

    if (!response.ok) {
        throw new Error(`Realty Mole Comps API error: ${response.status}`);
    }

    return response.json();
}

// Fetch sale records from Realty Mole
async function fetchSaleRecords(latitude, longitude, radius = 1) {
    const response = await fetch(
        `https://realty-mole-property-api.p.rapidapi.com/saleRecords?latitude=${latitude}&longitude=${longitude}&radius=${radius}&limit=10`,
        {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'realty-mole-property-api.p.rapidapi.com'
            }
        }
    );

    if (!response.ok) {
        throw new Error(`Sale Records API error: ${response.status}`);
    }

    return response.json();
}

// Fetch Zillow comps
async function fetchZillowComps(zpid) {
    const response = await fetch(
        `https://zillow-com1.p.rapidapi.com/propertyComps?zpid=${zpid}`,
        {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
            }
        }
    );

    if (!response.ok) {
        throw new Error(`Zillow Comps API error: ${response.status}`);
    }

    return response.json();
}

// Normalize comparable data
function normalizeComps(source, data, subjectProperty) {
    const comps = [];

    if (source === 'realtymole' && Array.isArray(data)) {
        for (const prop of data) {
            // Filter for similar properties
            if (subjectProperty) {
                const bedDiff = Math.abs((prop.bedrooms || 0) - (subjectProperty.beds || 0));
                const sqftDiff = Math.abs((prop.squareFootage || 0) - (subjectProperty.sqft || 0));

                // Skip if too different
                if (bedDiff > 2 || sqftDiff > 1000) continue;
            }

            comps.push({
                address: prop.formattedAddress || prop.addressLine1,
                price: prop.price || prop.lastSalePrice,
                beds: prop.bedrooms,
                baths: prop.bathrooms,
                sqft: prop.squareFootage,
                yearBuilt: prop.yearBuilt,
                pricePerSqft: prop.squareFootage ? Math.round((prop.price || prop.lastSalePrice) / prop.squareFootage) : null,
                saleDate: prop.lastSaleDate || prop.listedDate,
                daysOnMarket: prop.daysOnMarket,
                distance: prop.distance,
                latitude: prop.latitude,
                longitude: prop.longitude,
                source: 'Realty Mole'
            });
        }
    }

    if (source === 'zillow' && data.comps) {
        for (const comp of data.comps) {
            comps.push({
                address: comp.address?.streetAddress,
                price: comp.price || comp.zestimate,
                beds: comp.bedrooms,
                baths: comp.bathrooms,
                sqft: comp.livingArea,
                yearBuilt: comp.yearBuilt,
                pricePerSqft: comp.livingArea ? Math.round((comp.price || comp.zestimate) / comp.livingArea) : null,
                saleDate: comp.dateSold,
                latitude: comp.latitude,
                longitude: comp.longitude,
                zpid: comp.zpid,
                source: 'Zillow'
            });
        }
    }

    return comps;
}

// Calculate market statistics from comps
function calculateMarketStats(comps) {
    if (!comps || comps.length === 0) {
        return null;
    }

    const prices = comps.filter(c => c.price).map(c => c.price);
    const pricesPerSqft = comps.filter(c => c.pricePerSqft).map(c => c.pricePerSqft);
    const daysOnMarket = comps.filter(c => c.daysOnMarket).map(c => c.daysOnMarket);

    const avg = arr => arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : null;
    const median = arr => {
        if (!arr.length) return null;
        const sorted = [...arr].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
    };

    return {
        compCount: comps.length,
        avgPrice: avg(prices),
        medianPrice: median(prices),
        avgPricePerSqft: avg(pricesPerSqft),
        medianPricePerSqft: median(pricesPerSqft),
        avgDaysOnMarket: avg(daysOnMarket),
        priceRange: {
            low: Math.min(...prices),
            high: Math.max(...prices)
        }
    };
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
        const params = event.queryStringParameters || {};
        const { latitude, longitude, radius, beds, sqft, zpid } = params;

        if (!latitude || !longitude) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'latitude and longitude parameters are required' })
            };
        }

        if (!RAPIDAPI_KEY) {
            return {
                statusCode: 503,
                headers,
                body: JSON.stringify({
                    error: 'API key not configured',
                    message: 'Please set RAPIDAPI_KEY environment variable'
                })
            };
        }

        const subjectProperty = {
            beds: beds ? parseInt(beds) : null,
            sqft: sqft ? parseInt(sqft) : null
        };

        let allComps = [];
        const errors = [];

        // Fetch from Realty Mole - recent sales
        try {
            const saleRecords = await fetchSaleRecords(latitude, longitude, radius || 1);
            const comps = normalizeComps('realtymole', saleRecords, subjectProperty);
            allComps.push(...comps);
        } catch (err) {
            errors.push({ source: 'Realty Mole Sales', error: err.message });
        }

        // Fetch active listings for market context
        try {
            const activeListings = await fetchRealtyMoleComps(latitude, longitude, radius || 1);
            const comps = normalizeComps('realtymole', activeListings, subjectProperty);
            allComps.push(...comps.map(c => ({ ...c, status: 'active' })));
        } catch (err) {
            errors.push({ source: 'Realty Mole Listings', error: err.message });
        }

        // If we have a Zillow ID, get their comps too
        if (zpid) {
            try {
                const zillowComps = await fetchZillowComps(zpid);
                const comps = normalizeComps('zillow', zillowComps, subjectProperty);
                allComps.push(...comps);
            } catch (err) {
                errors.push({ source: 'Zillow', error: err.message });
            }
        }

        // Remove duplicates by address
        const uniqueComps = [];
        const seen = new Set();
        for (const comp of allComps) {
            const key = comp.address?.toLowerCase().replace(/\s+/g, '');
            if (key && !seen.has(key)) {
                seen.add(key);
                uniqueComps.push(comp);
            }
        }

        // Sort by date (most recent first)
        uniqueComps.sort((a, b) => {
            if (!a.saleDate) return 1;
            if (!b.saleDate) return -1;
            return new Date(b.saleDate) - new Date(a.saleDate);
        });

        // Calculate market statistics
        const marketStats = calculateMarketStats(uniqueComps.filter(c => c.status !== 'active'));

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                comparables: uniqueComps.slice(0, 10),
                marketStats,
                errors: errors.length > 0 ? errors : undefined
            })
        };

    } catch (error) {
        console.error('Comparables error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error', message: error.message })
        };
    }
};
