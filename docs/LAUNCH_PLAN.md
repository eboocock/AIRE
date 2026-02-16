# AIREA MVP Launch Plan
## Fastest Path to Market

### Positioning Change: FSBO Technology Platform

**Old positioning (risky):**
> "AIREA is your AI Real Estate Agent"

**New positioning (safe):**
> "AIREA is an AI-powered platform that helps homeowners sell FSBO"

This distinction matters legally. We're a **technology tool**, not a licensed agent.

---

## Phase 1: Launch in 1-2 Weeks

### What We Launch With

| Feature | Status | Notes |
|---------|--------|-------|
| AI Property Valuation | Ready | Clearly labeled as "estimate, not appraisal" |
| AI Listing Writer | Ready | Generates descriptions from user input |
| Photo Management | Ready | Upload, organize, pick primary |
| Showing Scheduler | Ready | Calendar coordination tool |
| Offer Tracker | Ready | Organize and compare offers |
| Dashboard | Ready | Centralized management |

### What We DON'T Do (Yet)

| Feature | Why Not | Alternative |
|---------|---------|-------------|
| MLS Listing | Requires broker | Partner with flat-fee MLS service |
| Contract Generation | Legal liability | Provide templates, recommend attorney |
| Escrow/Title | Licensed activity | Refer to title companies |
| Negotiation Advice | Fiduciary duty | AI insights only, no recommendations |

---

## Phase 2: Partnership Model (Week 2-4)

### MLS Access via Partner Broker

Instead of becoming a brokerage, partner with existing flat-fee MLS services:

**Option A: White-label partnership**
- Partner: Homecoin, Houzeo, or similar
- They handle: MLS listing, broker compliance
- We handle: Everything else (AI, UX, leads)
- Revenue: Split or referral fee

**Option B: Referral model**
- User completes listing on AIREA
- We refer to partner for MLS ($100-300 fee to them)
- We charge for our AI platform ($499)
- Total user cost: $599-799 (still way under 6%)

### Document Handling

**Safe approach:**
1. Use state-specific templates from established providers:
   - DocuSign has real estate templates
   - Dotloop (owned by Zillow)
   - SkySlope
2. Include disclaimers: "These are templates. Consult an attorney."
3. Don't "generate" contracts — let users fill in templates

---

## Phase 3: Geographic Focus

### Start with ONE State

**Recommended: Washington State**
- You seem to be based here (Sammamish references)
- Single set of disclosure requirements
- NWMLS is the dominant MLS

**Washington-specific requirements:**
- Seller Disclosure Statement (Form 17)
- Lead-based paint disclosure (pre-1978 homes)
- Agency disclosure

**We provide:**
- Links to official WA forms
- Guidance on what to fill out
- NOT legal advice

---

## Pricing Adjustment

### Current: $499 flat fee

This works, but consider:

| Tier | Price | Includes |
|------|-------|----------|
| **DIY** | $299 | AI valuation, listing writer, dashboard, templates |
| **MLS** | $499 | Above + MLS via partner broker |
| **Concierge** | $999 | Above + human support, document review referral |

---

## Legal Safeguards

### 1. Terms of Service Updates

Add explicit disclaimers:
- "AIREA is a technology platform, not a real estate brokerage"
- "AI valuations are estimates and should not replace professional appraisals"
- "Users should consult licensed professionals for legal and financial advice"
- "Contract templates are provided for convenience; consult an attorney"

### 2. No Fiduciary Language

Avoid:
- "We represent you"
- "In your best interest"
- "As your agent"

Use instead:
- "Tools to help you"
- "Information to consider"
- "Your decision"

### 3. State-Specific Compliance

For WA launch:
- Review WAC 308-124 (real estate licensing rules)
- Ensure we don't cross into "brokerage services"
- FSBO assistance is generally allowed

---

## Technical Changes Needed

### 1. Update Branding/Copy

Change "AI Real Estate Agent" references to:
- "AI-Powered FSBO Platform"
- "Sell Your Home Yourself, Smarter"
- "AI Tools for Home Sellers"

### 2. Add Disclaimers

- Valuation page: "This is an estimate based on public data..."
- Contract templates: "Consult a licensed attorney..."
- Offer analysis: "For informational purposes only..."

### 3. Partner Integration

Create placeholder for MLS partner:
- "Add MLS Listing" button → explains partner process
- Clear on what's AIREA vs. partner service

---

## Launch Checklist

### Week 1: Foundation
- [ ] Update positioning language across site
- [ ] Add legal disclaimers to key pages
- [ ] Create Washington-specific document links
- [ ] Set up Stripe for $299/$499 tiers
- [ ] Deploy to production domain

### Week 2: Partnerships
- [ ] Contact 2-3 flat-fee MLS services for partnership
- [ ] Integrate partner referral flow
- [ ] Set up document template provider (DocuSign/similar)

### Week 3: Soft Launch
- [ ] Beta users (friends/family selling homes)
- [ ] Collect feedback
- [ ] Iterate on UX pain points

### Week 4: Marketing
- [ ] SEO content: "How to sell FSBO in Washington"
- [ ] Social proof: First success stories
- [ ] Paid ads: Target "FSBO", "sell home without agent"

---

## Cost Breakdown

| Item | Cost | Notes |
|------|------|-------|
| Domain (airea.ai) | $50/year | If available |
| Vercel hosting | $0-20/month | Free tier works initially |
| Supabase | $0-25/month | Free tier works |
| Stripe fees | 2.9% + $0.30 | Per transaction |
| RapidAPI (property data) | $0-100/month | Based on usage |
| Anthropic API | $20-100/month | Based on usage |
| **Total monthly** | **~$50-150** | Before revenue |

### Revenue needed to break even:
- At $299/listing: 1-2 listings/month
- At $499/listing: 1 listing/month

---

## Risk Mitigation

### If challenged on licensing:
1. We provide software tools, not brokerage services
2. Users make all decisions themselves
3. We explicitly recommend professional consultation
4. We don't hold ourselves out as licensed agents

### Insurance:
- Consider E&O insurance once revenue supports it (~$1-2K/year)
- General liability for business

---

## Summary: Launch in 2 Weeks

1. **Reposition**: Tech platform, not agent
2. **Focus**: Washington State only
3. **Partner**: Flat-fee broker for MLS
4. **Disclaim**: Clear language on all AI outputs
5. **Price**: $299 DIY, $499 with MLS
6. **Cost**: <$150/month to operate

The AI is the value proposition. The regulatory complexity is avoided by being a tool, not a service provider.
