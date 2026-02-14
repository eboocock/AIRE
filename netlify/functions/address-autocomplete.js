// Address Autocomplete API - Provides real-time address suggestions
// Uses Google Places API for accurate address completion

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

// Google Places Autocomplete
async function getGoogleAutocomplete(input, sessionToken) {
    const params = new URLSearchParams({
        input: input,
        types: 'address',
        components: 'country:us',
        key: GOOGLE_PLACES_API_KEY
    });

    if (sessionToken) {
        params.append('sessiontoken', sessionToken);
    }

    const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?${params}`
    );

    if (!response.ok) {
        throw new Error(`Google Places API error: ${response.status}`);
    }

    return response.json();
}

// Google Place Details (for getting full address and coordinates)
async function getPlaceDetails(placeId, sessionToken) {
    const params = new URLSearchParams({
        place_id: placeId,
        fields: 'formatted_address,address_components,geometry,name',
        key: GOOGLE_PLACES_API_KEY
    });

    if (sessionToken) {
        params.append('sessiontoken', sessionToken);
    }

    const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?${params}`
    );

    if (!response.ok) {
        throw new Error(`Google Place Details API error: ${response.status}`);
    }

    return response.json();
}

// Parse Google address components
function parseAddressComponents(components) {
    const result = {};

    for (const component of components) {
        if (component.types.includes('street_number')) {
            result.streetNumber = component.long_name;
        }
        if (component.types.includes('route')) {
            result.street = component.long_name;
        }
        if (component.types.includes('locality')) {
            result.city = component.long_name;
        }
        if (component.types.includes('administrative_area_level_2')) {
            result.county = component.long_name;
        }
        if (component.types.includes('administrative_area_level_1')) {
            result.state = component.short_name;
            result.stateFull = component.long_name;
        }
        if (component.types.includes('postal_code')) {
            result.zipCode = component.long_name;
        }
        if (component.types.includes('country')) {
            result.country = component.short_name;
        }
    }

    return result;
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
        const { input, placeId, sessionToken } = params;

        if (!GOOGLE_PLACES_API_KEY) {
            return {
                statusCode: 503,
                headers,
                body: JSON.stringify({
                    error: 'API key not configured',
                    message: 'Please set GOOGLE_PLACES_API_KEY environment variable'
                })
            };
        }

        // If placeId is provided, fetch full details
        if (placeId) {
            const details = await getPlaceDetails(placeId, sessionToken);

            if (details.status !== 'OK') {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Place not found', status: details.status })
                };
            }

            const result = details.result;
            const parsed = parseAddressComponents(result.address_components || []);

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    formattedAddress: result.formatted_address,
                    ...parsed,
                    latitude: result.geometry?.location?.lat,
                    longitude: result.geometry?.location?.lng,
                    placeId: placeId
                })
            };
        }

        // Otherwise, perform autocomplete
        if (!input || input.length < 3) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Input must be at least 3 characters' })
            };
        }

        const autocomplete = await getGoogleAutocomplete(input, sessionToken);

        if (autocomplete.status !== 'OK' && autocomplete.status !== 'ZERO_RESULTS') {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Autocomplete failed', status: autocomplete.status })
            };
        }

        const suggestions = (autocomplete.predictions || []).map(prediction => ({
            description: prediction.description,
            placeId: prediction.place_id,
            mainText: prediction.structured_formatting?.main_text,
            secondaryText: prediction.structured_formatting?.secondary_text
        }));

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ suggestions })
        };

    } catch (error) {
        console.error('Address autocomplete error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error', message: error.message })
        };
    }
};
