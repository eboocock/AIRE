# AIRE Deployment Guide

AIRE uses real property data APIs to provide accurate valuations, comparable sales, and market intelligence. This guide covers deploying to Netlify with proper API configuration.

## Quick Start

### Option 1: Deploy to Netlify (Recommended)

1. **Fork or clone this repository**

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com) and sign up/login
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Build settings will auto-detect from `netlify.toml`

3. **Configure Environment Variables**

   In Netlify Dashboard → Site Settings → Environment Variables, add:

   | Variable | Required | Description |
   |----------|----------|-------------|
   | `RAPIDAPI_KEY` | Yes* | RapidAPI key for Realty Mole & Zillow APIs |
   | `ATTOM_API_KEY` | Yes* | ATTOM Data API key (alternative to RapidAPI) |
   | `GOOGLE_PLACES_API_KEY` | Recommended | Google Places API for address autocomplete |
   | `WALKSCORE_API_KEY` | Optional | Walk Score API for walkability data |
   | `ANTHROPIC_API_KEY` | Optional | Claude AI for listing descriptions |
   | `OPENAI_API_KEY` | Optional | OpenAI fallback for AI features |

   *At least one property data API is required (RapidAPI or ATTOM)

4. **Deploy**
   - Netlify will automatically deploy when you push to main
   - Your site will be live at `your-site-name.netlify.app`

### Option 2: GitHub Pages (Demo Mode Only)

GitHub Pages will work but runs in **demo mode** with simulated data since it can't securely store API keys. The existing `.github/workflows/static.yml` handles GitHub Pages deployment.

## API Setup Instructions

### 1. RapidAPI (Recommended - Multiple APIs)

RapidAPI provides access to multiple property data APIs with a single key:

1. Create account at [rapidapi.com](https://rapidapi.com)
2. Subscribe to these APIs:
   - **Realty Mole Property API** - [Subscribe](https://rapidapi.com/realtymole/api/realty-mole-property-api)
     - Free tier: 50 requests/month
     - Provides: Property details, valuations, sale records
   - **Zillow API** - [Subscribe](https://rapidapi.com/apimaker/api/zillow-com1)
     - Pay-per-request (~$0.01/request)
     - Provides: Zestimates, photos, detailed property data
3. Copy your RapidAPI key from Dashboard → My Apps

### 2. Google Places API (Address Autocomplete)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable these APIs:
   - Places API
   - Geocoding API
4. Create credentials → API Key
5. Restrict key to:
   - HTTP referrers: `your-site.netlify.app/*`
   - API restrictions: Places API, Geocoding API

### 3. ATTOM Data API (Alternative Property Data)

1. Sign up at [ATTOM Data](https://api.gateway.attomdata.com/)
2. Contact for API access (enterprise pricing)
3. Use for comprehensive property data if RapidAPI doesn't meet needs

### 4. Walk Score API

1. Sign up at [Walk Score](https://www.walkscore.com/professional/api.php)
2. Free for non-commercial use
3. Provides walkability, transit, and bike scores

### 5. AI APIs (Optional - Enhanced Features)

For AI-generated listing descriptions:

**Anthropic Claude (Recommended):**
1. Sign up at [console.anthropic.com](https://console.anthropic.com)
2. Create API key
3. Uses Claude Haiku (~$0.001 per description)

**OpenAI (Fallback):**
1. Sign up at [platform.openai.com](https://platform.openai.com)
2. Create API key
3. Uses GPT-3.5-turbo (~$0.001 per description)

## Local Development

1. Install dependencies:
   ```bash
   npm install netlify-cli -g
   ```

2. Create `.env` file from template:
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. Run locally with Netlify Dev:
   ```bash
   netlify dev
   ```

   This runs the site with serverless functions at `http://localhost:8888`

## Architecture

```
AIRE/
├── index.html           # Main React application
├── netlify.toml         # Netlify configuration
├── netlify/
│   └── functions/
│       ├── property-data.js      # Property details API
│       ├── comparables.js        # Comparable sales API
│       ├── market-data.js        # Market intelligence API
│       ├── address-autocomplete.js # Google Places integration
│       └── ai-analysis.js        # AI valuation & listing generation
└── .env.example         # Environment variables template
```

## API Endpoints

When deployed, these endpoints are available:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/property-data?address=...` | GET | Property details and valuation |
| `/api/comparables?lat=...&lon=...` | GET | Comparable sales data |
| `/api/market-data?lat=...&lon=...` | GET | Market conditions & scores |
| `/api/address-autocomplete?input=...` | GET | Address suggestions |
| `/api/ai-analysis` | POST | AI-powered analysis synthesis |

## Troubleshooting

### "Demo Mode" showing instead of real data

1. Verify environment variables are set in Netlify
2. Check Netlify Functions logs for API errors
3. Ensure API keys are valid and have sufficient quota

### Address autocomplete not working

1. Verify `GOOGLE_PLACES_API_KEY` is set
2. Check Google Cloud Console for API errors
3. Ensure Places API is enabled and key isn't restricted

### Comparables not loading

1. Check RapidAPI dashboard for quota usage
2. Verify property address returns valid coordinates
3. Try a different address in a well-populated area

## Cost Estimation

For a site with ~1,000 property analyses per month:

| Service | Monthly Cost |
|---------|-------------|
| Realty Mole (RapidAPI) | ~$50 (5,000 requests) |
| Google Places | ~$10 (covered by free tier) |
| AI Descriptions | ~$1 |
| Netlify Hosting | Free tier |
| **Total** | **~$60/month** |

## Support

For API issues:
- RapidAPI: support@rapidapi.com
- Google Cloud: cloud.google.com/support
- ATTOM: support@attomdata.com
