// Property Data API - Fetches real property information from multiple sources
// Integrates with: Realty Mole, ATTOM, and Zillow APIs via RapidAPI

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const ATTOM_API_KEY = process.env.ATTOM_API_KEY;

// Realty Mole Property API (RapidAPI) - Free tier: 50 requests/month
async function fetchRealtyMoleData(address) {
    const encodedAddress = encodeURIComponent(address);

    const response = await fetch(
        `https://realty-mole-property-api.p.rapidapi.com/properties?address=${encodedAddress}`,
        {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'realty-mole-property-api.p.rapidapi.com'
            }
        }
    );

    if (!response.ok) {
        throw new Error(`Realty Mole API error: ${response.status}`);
    }

    return response.json();
}

// Zillow Property API (RapidAPI)
async function fetchZillowData(address) {
    const encodedAddress = encodeURIComponent(address);

    const response = await fetch(
        `https://zillow-com1.p.rapidapi.com/property?address=${encodedAddress}`,
        {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
            }
        }
    );

    if (!response.ok) {
        throw new Error(`Zillow API error: ${response.status}`);
    }

    return response.json();
}

// ATTOM Property API - Comprehensive property data
async function fetchAttomData(address) {
    const encodedAddress = encodeURIComponent(address);

    const response = await fetch(
        `https://api.gateway.attomdata.com/propertyapi/v1.0.0/property/address?address=${encodedAddress}`,
        {
            method: 'GET',
            headers: {
                'apikey': ATTOM_API_KEY,
                'Accept': 'application/json'
            }
        }
    );

    if (!response.ok) {
        throw new Error(`ATTOM API error: ${response.status}`);
    }

    return response.json();
}

// Normalize data from different sources into a unified format
function normalizePropertyData(source, data) {
    if (source === 'realtymole' && data.length > 0) {
        const prop = data[0];
        return {
            source: 'Realty Mole',
            address: prop.formattedAddress || prop.addressLine1,
            city: prop.city,
            state: prop.state,
            zipCode: prop.zipCode,
            county: prop.county,
            beds: prop.bedrooms,
            baths: prop.bathrooms,
            sqft: prop.squareFootage,
            lotSize: prop.lotSize,
            yearBuilt: prop.yearBuilt,
            propertyType: prop.propertyType,
            estimatedValue: prop.estimatedValue || prop.price,
            lastSaleDate: prop.lastSaleDate,
            lastSalePrice: prop.lastSalePrice,
            taxAssessedValue: prop.taxAssessedValue,
            latitude: prop.latitude,
            longitude: prop.longitude,
            features: prop.features || [],
            raw: prop
        };
    }

    if (source === 'zillow') {
        return {
            source: 'Zillow',
            address: data.address?.streetAddress,
            city: data.address?.city,
            state: data.address?.state,
            zipCode: data.address?.zipcode,
            beds: data.bedrooms,
            baths: data.bathrooms,
            sqft: data.livingArea,
            lotSize: data.lotSize,
            yearBuilt: data.yearBuilt,
            propertyType: data.homeType,
            estimatedValue: data.zestimate,
            rentEstimate: data.rentZestimate,
            priceHistory: data.priceHistory,
            taxHistory: data.taxHistory,
            latitude: data.latitude,
            longitude: data.longitude,
            description: data.description,
            photos: data.photos || [],
            raw: data
        };
    }

    if (source === 'attom' && data.property?.length > 0) {
        const prop = data.property[0];
        return {
            source: 'ATTOM',
            address: prop.address?.line1,
            city: prop.address?.locality,
            state: prop.address?.countrySubd,
            zipCode: prop.address?.postal1,
            county: prop.area?.munname,
            beds: prop.building?.rooms?.beds,
            baths: prop.building?.rooms?.bathsfull,
            sqft: prop.building?.size?.livingsize,
            lotSize: prop.lot?.lotsize1,
            yearBuilt: prop.summary?.yearbuilt,
            propertyType: prop.summary?.proptype,
            estimatedValue: prop.avm?.amount?.value,
            taxAssessedValue: prop.assessment?.assessed?.assdttlvalue,
            latitude: prop.location?.latitude,
            longitude: prop.location?.longitude,
            raw: prop
        };
    }

    return null;
}

exports.handler = async (event, context) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        const params = event.queryStringParameters || {};
        const address = params.address;

        if (!address) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Address parameter is required' })
            };
        }

        // Check if API keys are configured
        if (!RAPIDAPI_KEY && !ATTOM_API_KEY) {
            return {
                statusCode: 503,
                headers,
                body: JSON.stringify({
                    error: 'API keys not configured',
                    message: 'Please set RAPIDAPI_KEY or ATTOM_API_KEY environment variables'
                })
            };
        }

        const results = {
            address: address,
            sources: [],
            data: null,
            comparables: [],
            marketData: null
        };

        // Try multiple data sources and aggregate results
        const errors = [];

        // Try Realty Mole first (good free tier)
        if (RAPIDAPI_KEY) {
            try {
                const realtyMoleData = await fetchRealtyMoleData(address);
                const normalized = normalizePropertyData('realtymole', realtyMoleData);
                if (normalized) {
                    results.sources.push('Realty Mole');
                    results.data = normalized;
                }
            } catch (err) {
                errors.push({ source: 'Realty Mole', error: err.message });
            }

            // Try Zillow for additional data
            try {
                const zillowData = await fetchZillowData(address);
                const normalized = normalizePropertyData('zillow', zillowData);
                if (normalized) {
                    results.sources.push('Zillow');
                    // Merge Zillow data with existing
                    if (results.data) {
                        results.data.zestimate = normalized.estimatedValue;
                        results.data.rentEstimate = normalized.rentEstimate;
                        results.data.priceHistory = normalized.priceHistory;
                        results.data.photos = normalized.photos;
                        results.data.description = normalized.description;
                    } else {
                        results.data = normalized;
                    }
                }
            } catch (err) {
                errors.push({ source: 'Zillow', error: err.message });
            }
        }

        // Try ATTOM if we have that key
        if (ATTOM_API_KEY) {
            try {
                const attomData = await fetchAttomData(address);
                const normalized = normalizePropertyData('attom', attomData);
                if (normalized) {
                    results.sources.push('ATTOM');
                    if (!results.data) {
                        results.data = normalized;
                    } else {
                        // ATTOM often has better tax data
                        results.data.taxAssessedValue = normalized.taxAssessedValue || results.data.taxAssessedValue;
                    }
                }
            } catch (err) {
                errors.push({ source: 'ATTOM', error: err.message });
            }
        }

        if (!results.data) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({
                    error: 'Property not found',
                    address: address,
                    apiErrors: errors
                })
            };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(results)
        };

    } catch (error) {
        console.error('Property data error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error', message: error.message })
        };
    }
};
