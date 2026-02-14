// Market Data API - Fetches real market intelligence
// Provides neighborhood trends, school ratings, walk scores, and market conditions

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const WALKSCORE_API_KEY = process.env.WALKSCORE_API_KEY;

// Fetch Walk Score data
async function fetchWalkScore(latitude, longitude, address) {
    if (!WALKSCORE_API_KEY) return null;

    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(
        `https://api.walkscore.com/score?format=json&lat=${latitude}&lon=${longitude}&address=${encodedAddress}&wsapikey=${WALKSCORE_API_KEY}`
    );

    if (!response.ok) {
        throw new Error(`Walk Score API error: ${response.status}`);
    }

    return response.json();
}

// Fetch school data from RapidAPI
async function fetchSchoolData(latitude, longitude) {
    const response = await fetch(
        `https://us-school-data.p.rapidapi.com/schools/nearby?lat=${latitude}&lon=${longitude}&radius=5`,
        {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'us-school-data.p.rapidapi.com'
            }
        }
    );

    if (!response.ok) {
        throw new Error(`School Data API error: ${response.status}`);
    }

    return response.json();
}

// Fetch Zillow neighborhood data
async function fetchZillowRegionData(regionId) {
    const response = await fetch(
        `https://zillow-com1.p.rapidapi.com/regionChildren?regionId=${regionId}`,
        {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
            }
        }
    );

    if (!response.ok) {
        throw new Error(`Zillow Region API error: ${response.status}`);
    }

    return response.json();
}

// Fetch local market trends via Redfin-style data
async function fetchMarketTrends(zipCode) {
    // Using a market trends API endpoint
    const response = await fetch(
        `https://realty-mole-property-api.p.rapidapi.com/zipCodes/${zipCode}`,
        {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'realty-mole-property-api.p.rapidapi.com'
            }
        }
    );

    if (!response.ok) {
        throw new Error(`Market Trends API error: ${response.status}`);
    }

    return response.json();
}

// Calculate market temperature based on data
function calculateMarketTemperature(data) {
    const indicators = {
        daysOnMarket: data.avgDaysOnMarket || 30,
        priceChange: data.priceChangePercent || 0,
        inventoryLevel: data.inventoryLevel || 'moderate',
        listToSaleRatio: data.listToSaleRatio || 0.97
    };

    let score = 50; // Neutral baseline

    // Faster sales = hotter market
    if (indicators.daysOnMarket < 14) score += 20;
    else if (indicators.daysOnMarket < 21) score += 15;
    else if (indicators.daysOnMarket < 30) score += 10;
    else if (indicators.daysOnMarket > 60) score -= 15;
    else if (indicators.daysOnMarket > 45) score -= 10;

    // Rising prices = hotter market
    if (indicators.priceChange > 10) score += 20;
    else if (indicators.priceChange > 5) score += 15;
    else if (indicators.priceChange > 0) score += 5;
    else if (indicators.priceChange < -5) score -= 15;
    else if (indicators.priceChange < 0) score -= 5;

    // List-to-sale ratio (selling above asking = hot)
    if (indicators.listToSaleRatio > 1.02) score += 15;
    else if (indicators.listToSaleRatio > 1.0) score += 10;
    else if (indicators.listToSaleRatio < 0.95) score -= 10;

    // Determine market temperature label
    if (score >= 80) return { label: 'Very Hot', emoji: '🔥🔥', color: 'red', score };
    if (score >= 65) return { label: 'Hot', emoji: '🔥', color: 'orange', score };
    if (score >= 50) return { label: 'Warm', emoji: '☀️', color: 'yellow', score };
    if (score >= 35) return { label: 'Balanced', emoji: '⚖️', color: 'blue', score };
    return { label: 'Cool', emoji: '❄️', color: 'cyan', score };
}

// Determine best time to list based on historical data
function getBestTimeToList(state, marketTemp) {
    // General best months by region
    const regionalBestMonths = {
        'WA': 'March-May',
        'CA': 'April-June',
        'TX': 'March-May',
        'FL': 'February-April',
        'NY': 'April-June',
        'default': 'April-June'
    };

    // Adjust recommendation based on market temperature
    const bestMonth = regionalBestMonths[state] || regionalBestMonths['default'];

    if (marketTemp.score >= 70) {
        return {
            recommendation: 'List Now',
            reason: 'Market conditions are excellent - high demand and fast sales',
            bestMonth
        };
    } else if (marketTemp.score >= 50) {
        return {
            recommendation: bestMonth,
            reason: 'Typical peak selling season for your area',
            bestMonth
        };
    } else {
        return {
            recommendation: 'Consider Waiting',
            reason: 'Market is slower - consider waiting for spring if possible',
            bestMonth
        };
    }
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
        const { latitude, longitude, address, zipCode, state } = params;

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

        const results = {
            walkScore: null,
            transitScore: null,
            bikeScore: null,
            schools: [],
            marketTemperature: null,
            bestTimeToList: null,
            neighborhoodStats: null
        };

        const errors = [];

        // Fetch Walk Score
        if (WALKSCORE_API_KEY && address) {
            try {
                const walkData = await fetchWalkScore(latitude, longitude, address);
                results.walkScore = walkData.walkscore;
                results.transitScore = walkData.transit?.score;
                results.bikeScore = walkData.bike?.score;
                results.walkScoreDescription = walkData.description;
            } catch (err) {
                errors.push({ source: 'Walk Score', error: err.message });
            }
        }

        // Fetch school data
        try {
            const schoolData = await fetchSchoolData(latitude, longitude);
            if (schoolData && Array.isArray(schoolData)) {
                results.schools = schoolData.slice(0, 5).map(school => ({
                    name: school.name,
                    type: school.type,
                    grades: school.grades,
                    rating: school.rating,
                    distance: school.distance
                }));

                // Calculate average school rating
                const ratings = results.schools.filter(s => s.rating).map(s => s.rating);
                if (ratings.length > 0) {
                    results.avgSchoolRating = Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length * 10) / 10;
                }
            }
        } catch (err) {
            errors.push({ source: 'Schools', error: err.message });
        }

        // Fetch market trends if zip code provided
        if (zipCode) {
            try {
                const marketData = await fetchMarketTrends(zipCode);
                if (marketData) {
                    results.neighborhoodStats = {
                        medianHomeValue: marketData.medianHomeValue,
                        medianRent: marketData.medianRent,
                        avgPricePerSqft: marketData.avgPricePerSqft,
                        homeValueChange: marketData.homeValueChange,
                        population: marketData.population,
                        medianIncome: marketData.medianIncome
                    };

                    results.marketTemperature = calculateMarketTemperature({
                        avgDaysOnMarket: marketData.avgDaysOnMarket,
                        priceChangePercent: marketData.homeValueChange,
                        listToSaleRatio: marketData.listToSaleRatio
                    });
                }
            } catch (err) {
                errors.push({ source: 'Market Trends', error: err.message });
            }
        }

        // Calculate market temperature if not already set
        if (!results.marketTemperature) {
            results.marketTemperature = calculateMarketTemperature({});
        }

        // Determine best time to list
        results.bestTimeToList = getBestTimeToList(state || 'WA', results.marketTemperature);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                ...results,
                errors: errors.length > 0 ? errors : undefined
            })
        };

    } catch (error) {
        console.error('Market data error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error', message: error.message })
        };
    }
};
