# AIRE FSBO Platform Specification
## Washington State For Sale By Owner Complete Solution

**Version**: 1.0
**Target Market**: Washington State Residential Property Sellers
**Business Model**: Freemium (Free listings, paid for transactions)

---

## Executive Summary

AIRE FSBO Platform is a comprehensive web application that guides Washington State homeowners through the entire For Sale By Owner process—from creating a listing to closing the sale. The platform provides a modern, user-friendly interface with a clear value proposition: list for free, pay only when you're ready to accept offers and close.

---

## Monetization Strategy

### Free Tier (MVP)
✅ Create unlimited property listings
✅ Step-by-step guided listing wizard
✅ Photo/video upload (up to 30 images)
✅ Public listing page with SEO optimization
✅ Listing management dashboard
✅ Basic analytics (views, favorites)
✅ Showing scheduler
✅ Buyer inquiry messages (view only)

### Paid Tier - "Close It" Package ($499/listing)
🔓 **Unlock when ready to accept offers:**
- Full offer management system
- Buyer-seller messaging
- Washington State legal document templates:
  - Purchase and Sale Agreement
  - Seller Disclosure Statement (Form 17)
  - Lead-Based Paint Disclosure
  - HOA documents
  - Addendums and amendments
- Electronic signature integration (DocuSign)
- Transaction coordination dashboard
- Closing checklist and timeline
- Title/escrow company coordination
- Document storage and management
- Email/SMS notifications
- Priority customer support

### Add-On Services (Optional)
- **Premium Placement**: $99/month - Featured on homepage and top of search
- **Professional Photography**: $199 - Vetted photographer booking
- **Marketing Kit**: $149 - Print materials, social media graphics, yard signs
- **Attorney Review**: $299 - Pre-listing legal consultation

---

## Technical Architecture

### Frontend Stack
```
Next.js 14.2+ (App Router)
├── TypeScript 5.3+
├── Tailwind CSS 3.4+
├── Shadcn UI Components
├── React Hook Form (forms)
├── Zod (validation)
├── TanStack Query (data fetching)
└── Framer Motion (animations)
```

### Backend Stack
```
Next.js API Routes
├── Supabase (PostgreSQL + Auth + Storage + Realtime)
├── Stripe (payments & subscriptions)
├── Resend (transactional email)
├── Twilio (SMS notifications)
├── DocuSign API (e-signatures)
└── Vercel (hosting)
```

### Third-Party Integrations
- **Google Maps API**: Address autocomplete and property location
- **Cloudinary**: Image optimization and CDN
- **Sentry**: Error tracking and monitoring
- **PostHog/Plausible**: Privacy-focused analytics
- **Uploadthing**: File uploads with progress tracking

---

## Database Schema

### Core Tables

#### `users`
```sql
id: uuid (PK)
email: text (unique)
full_name: text
phone: text
user_type: enum ('seller', 'buyer', 'both')
avatar_url: text
created_at: timestamp
updated_at: timestamp
subscription_status: enum ('free', 'active', 'cancelled')
```

#### `listings`
```sql
id: uuid (PK)
user_id: uuid (FK -> users)
status: enum ('draft', 'active', 'pending', 'sold', 'expired')
-- Property Details
address_line1: text
address_line2: text
city: text
state: text (default 'WA')
zip_code: text
county: text
-- Property Info
property_type: enum ('single_family', 'condo', 'townhouse', 'multi_family', 'land', 'mobile')
bedrooms: integer
bathrooms: decimal
sqft: integer
lot_size: decimal
year_built: integer
-- Listing Details
price: decimal
description: text
features: jsonb (parking, ac, heating, etc.)
photos: jsonb (array of {url, order, caption})
video_url: text
virtual_tour_url: text
-- SEO & Marketing
slug: text (unique)
meta_description: text
-- Analytics
views: integer (default 0)
favorites: integer (default 0)
inquiries: integer (default 0)
-- Timestamps
created_at: timestamp
updated_at: timestamp
published_at: timestamp
expires_at: timestamp (default +90 days)
```

#### `listing_access`
```sql
id: uuid (PK)
listing_id: uuid (FK -> listings)
transaction_unlocked: boolean (default false)
unlocked_at: timestamp
stripe_payment_intent_id: text
amount_paid: decimal
```

#### `offers`
```sql
id: uuid (PK)
listing_id: uuid (FK -> listings)
buyer_id: uuid (FK -> users)
status: enum ('pending', 'viewed', 'accepted', 'rejected', 'countered', 'expired')
-- Offer Details
offer_price: decimal
earnest_money: decimal
down_payment_percent: decimal
financing_type: enum ('conventional', 'fha', 'va', 'cash', 'other')
pre_approval_url: text
-- Terms
closing_date: date
inspection_contingency: boolean
financing_contingency: boolean
appraisal_contingency: boolean
sale_of_home_contingency: boolean
other_contingencies: text
-- Additional
buyer_message: text
seller_response: text
-- Timestamps
created_at: timestamp
expires_at: timestamp
responded_at: timestamp
```

#### `messages`
```sql
id: uuid (PK)
listing_id: uuid (FK -> listings)
offer_id: uuid (FK -> offers, nullable)
sender_id: uuid (FK -> users)
recipient_id: uuid (FK -> users)
content: text
read_at: timestamp
created_at: timestamp
```

#### `documents`
```sql
id: uuid (PK)
listing_id: uuid (FK -> listings)
offer_id: uuid (FK -> offers, nullable)
document_type: enum ('disclosure', 'purchase_agreement', 'addendum', 'inspection', 'other')
title: text
file_url: text
file_size: integer
mime_type: text
requires_signature: boolean
signed_by: jsonb (array of user_ids)
signed_at: timestamp
created_by: uuid (FK -> users)
created_at: timestamp
```

#### `showings`
```sql
id: uuid (PK)
listing_id: uuid (FK -> listings)
buyer_id: uuid (FK -> users)
requested_date: timestamp
requested_time: text
status: enum ('requested', 'confirmed', 'cancelled', 'completed')
notes: text
created_at: timestamp
```

#### `transactions`
```sql
id: uuid (PK)
listing_id: uuid (FK -> listings)
seller_id: uuid (FK -> users)
buyer_id: uuid (FK -> users)
accepted_offer_id: uuid (FK -> offers)
status: enum ('under_contract', 'inspection', 'financing', 'final_walkthrough', 'closing', 'closed', 'cancelled')
closing_date: date
sale_price: decimal
-- Closing Details
title_company: text
escrow_number: text
closing_agent_name: text
closing_agent_email: text
closing_agent_phone: text
-- Checklist Progress
checklist: jsonb (array of tasks with completion status)
created_at: timestamp
updated_at: timestamp
closed_at: timestamp
```

---

## User Flows

### Seller Flow (MVP - Free)

1. **Registration/Login**
   - Email/password or OAuth (Google/Facebook)
   - Profile setup (name, phone, contact preferences)

2. **Create Listing - Guided Wizard**
   - **Step 1**: Property Address
     - Google Maps autocomplete
     - Verify address
   - **Step 2**: Property Details
     - Type, bedrooms, bathrooms, sqft, lot size
     - Year built, property condition
   - **Step 3**: Pricing
     - List price
     - Optional: HOA fees, property taxes
   - **Step 4**: Description & Features
     - AI-assisted description generator
     - Checkbox features (parking, AC, fireplace, etc.)
   - **Step 5**: Photos & Media
     - Drag-and-drop upload (up to 30 photos)
     - Set cover photo
     - Optional video tour URL
   - **Step 6**: Review & Publish
     - Preview listing
     - SEO meta description
     - Publish or save as draft

3. **Manage Listing**
   - Dashboard showing:
     - Listing status
     - Analytics (views, favorites, inquiries)
     - Recent activity
     - Scheduled showings
   - Edit listing details
   - Mark as pending/sold
   - Renew expired listings

4. **View Inquiries** (Read-only in free tier)
   - See buyer contact requests
   - View showing requests
   - **Paywall prompt**: "Unlock messaging to respond"

### Seller Flow (Paid - Transaction Unlocked)

5. **Receive & Manage Offers**
   - Email/SMS notification of new offer
   - Offer dashboard with comparison table
   - View offer details (price, terms, contingencies)
   - Download buyer's pre-approval letter

6. **Respond to Offers**
   - Accept offer → Initiate transaction
   - Reject offer with optional message
   - Counter offer with new terms

7. **Transaction Management**
   - Automated checklist based on accepted offer
   - Upload/request documents:
     - Seller disclosure
     - Purchase agreement (auto-generated)
     - Addendums
   - Send documents for e-signature
   - Track document status

8. **Closing Coordination**
   - Add title/escrow company details
   - Track closing timeline
   - Final walkthrough scheduling
   - Mark as closed

### Buyer Flow

1. **Browse Listings**
   - Search by location, price, beds/baths
   - Filter and sort results
   - Save favorites

2. **View Listing Details**
   - Photo gallery
   - Property details
   - Map and neighborhood info
   - Contact seller button

3. **Request Showing**
   - Select preferred date/time
   - Add message to seller
   - Submit request

4. **Submit Offer** (If seller has paid tier)
   - Fill out offer form:
     - Offer price
     - Earnest money
     - Financing details
     - Upload pre-approval letter
     - Contingencies
     - Proposed closing date
   - Submit to seller

5. **Negotiate & Sign**
   - Receive counter-offers
   - Message seller
   - Sign purchase agreement electronically

---

## Washington State Legal Requirements

### Required Disclosures

1. **Form 17 - Seller Disclosure Statement**
   - Required for all residential sales (1-4 units)
   - Must be provided before offer acceptance
   - Covers property condition, defects, repairs

2. **Lead-Based Paint Disclosure**
   - Required for homes built before 1978
   - 10-day inspection period

3. **HOA Documents** (if applicable)
   - CC&Rs, bylaws, financial statements
   - Resale certificate

4. **Material Facts**
   - Death on property (within 3 years)
   - Stigmatized property disclosures
   - Environmental hazards

### Document Templates (Paid Tier)

Platform will provide Washington State-specific templates:
- **Purchase and Sale Agreement** (NWMLS Form 21)
- **Form 17 - Seller Disclosure Statement**
- **Lead-Based Paint Disclosure** (EPA form)
- **Amendment to Purchase Agreement** (NWMLS Form 23)
- **Addendum** (NWMLS Form 22A)
- **Earnest Money Receipt**
- **Mutual Release Agreement**

**Legal Disclaimer**: Templates are for informational purposes. Users are encouraged to consult with a real estate attorney.

---

## Design Principles

### Visual Design
- **Modern & Clean**: Minimalist interface with ample whitespace
- **Professional**: Builds trust with homeowners making $500K+ decisions
- **Mobile-First**: 60%+ of users will browse on mobile
- **Accessible**: WCAG 2.1 AA compliant

### Color Palette
```
Primary: Blue (#0066CC) - Trust, stability
Secondary: Teal (#00BFA5) - Growth, success
Accent: Orange (#FF6B35) - Call-to-action
Neutral: Slate (#334155) - Text
Background: White/Light Gray (#F8FAFC)
Success: Green (#10B981)
Warning: Yellow (#F59E0B)
Error: Red (#EF4444)
```

### Typography
- **Headings**: Inter Bold (sans-serif)
- **Body**: Inter Regular
- **Monospace**: Fira Code (for numbers, prices)

### UI Components
- **Buttons**: Rounded corners, clear hover states
- **Cards**: Subtle shadows, hover elevation
- **Forms**: Inline validation, helpful error messages
- **Progress Indicators**: Step wizards, checklists
- **Modals**: Centered overlays for important actions

### UX Principles
1. **Progressive Disclosure**: Don't overwhelm users with all features at once
2. **Guided Workflows**: Step-by-step wizards for complex processes
3. **Instant Feedback**: Loading states, success messages, error handling
4. **Smart Defaults**: Pre-fill data when possible
5. **Clear CTAs**: Every page has an obvious next action
6. **Transparent Pricing**: Show paywall benefits before hiding features

---

## Key Features Breakdown

### MVP (Free Tier)

#### 1. Listing Creation Wizard
- Multi-step form with progress indicator
- Google Maps address autocomplete
- AI-assisted description generator
- Photo upload with drag-and-drop
- Real-time preview
- Save draft functionality

#### 2. Listing Management Dashboard
- Card view of all listings
- Quick stats (views, inquiries, days on market)
- Edit/delete/duplicate listings
- Status management (draft/active/pending/sold)

#### 3. Public Listing Page
- SEO-optimized URL structure (`/listing/{city}/{address-slug}`)
- Photo gallery with lightbox
- Interactive map
- Property details grid
- Share buttons (email, Facebook, Twitter)
- Print-friendly view
- Contact seller form

#### 4. Search & Browse
- Homepage with featured listings
- Search by city/zip code
- Filter by price, beds, baths, property type
- Sort by newest, price, sqft
- Map view of results
- Save favorites (logged-in users)

#### 5. Showing Scheduler
- Calendar picker for buyers
- Request showing form
- Seller notification
- Showing management for sellers (view only in free tier)

### Paid Tier Features

#### 6. Offer Management
- Offer submission form for buyers
- Offer comparison table for sellers
- Accept/reject/counter workflows
- Offer expiration tracking
- Email/SMS notifications

#### 7. Messaging System
- Real-time chat between buyer and seller
- Threaded conversations per listing/offer
- File attachments
- Typing indicators
- Unread message badges

#### 8. Legal Documents
- Washington State template library
- Document generator with pre-filled data
- Upload custom documents
- Version control (track changes)

#### 9. E-Signature Integration
- DocuSign embedded signing
- Track signature status
- Email reminders for unsigned docs
- Completed document storage

#### 10. Transaction Dashboard
- Visual timeline from offer to close
- Task checklist with due dates
- Document status tracker
- Title/escrow company info
- Important dates (inspection, appraisal, closing)

#### 11. Closing Coordinator
- Closing checklist generator
- Final walkthrough scheduler
- Utilities transfer reminders
- Moving checklist
- Transaction completion workflow

---

## Analytics & Metrics

### Seller Analytics (Per Listing)
- Total views
- Unique visitors
- Favorites/saves
- Inquiries count
- Showing requests
- Days on market
- Views over time graph

### Platform Metrics (Admin)
- Total listings (active/sold)
- Conversion rate (listings → transactions)
- Average time to sale
- User growth
- Revenue metrics
- Most popular cities/neighborhoods

---

## Email Notifications

### Seller Emails
- Welcome email with getting started guide
- Listing published confirmation
- Weekly performance digest
- New inquiry received
- Showing requested
- New offer received
- Offer accepted/rejected
- Document signed
- Task deadline reminders
- Transaction milestones

### Buyer Emails
- Saved search alerts (new listings)
- Favorite listing price changes
- Showing confirmed
- Offer status updates
- Document ready for signature

---

## SMS Notifications (Optional Opt-In)

- New offer on your listing
- Showing in next 24 hours
- Document requires signature
- Closing in 7 days

---

## Security & Compliance

### Data Protection
- SSL/TLS encryption (HTTPS)
- Encrypted database fields (SSN, financial info)
- Role-based access control (RBAC)
- Audit logs for document access

### Privacy
- GDPR-compliant data handling
- User data export capability
- Right to be forgotten (account deletion)
- Cookie consent management

### Payment Security
- PCI-DSS compliant (via Stripe)
- No credit card data stored
- Secure payment tokenization

---

## Development Phases

### Phase 1: Foundation (Weeks 1-2)
- [ ] Next.js project setup with TypeScript
- [ ] Tailwind + Shadcn UI configuration
- [ ] Supabase project creation and schema
- [ ] Authentication system (email + OAuth)
- [ ] User profile pages
- [ ] Navigation and layout components

### Phase 2: Listing Creation (Weeks 3-4)
- [ ] Listing wizard (6 steps)
- [ ] Photo upload with Cloudinary
- [ ] Address autocomplete (Google Maps)
- [ ] AI description generator
- [ ] Listing preview component
- [ ] Save draft functionality

### Phase 3: Public Listings (Weeks 5-6)
- [ ] Public listing detail pages
- [ ] Search and filter system
- [ ] Homepage with featured listings
- [ ] Photo gallery lightbox
- [ ] Map integration
- [ ] SEO optimization (meta tags, sitemaps)

### Phase 4: Dashboard & Management (Week 7)
- [ ] Seller dashboard
- [ ] Listing analytics
- [ ] Edit listing functionality
- [ ] Status management
- [ ] Showing scheduler (view-only)

### Phase 5: Payment Integration (Week 8)
- [ ] Stripe setup
- [ ] "Unlock Transaction" paywall
- [ ] Payment success/failure flows
- [ ] Receipt generation

### Phase 6: Offer System (Weeks 9-10) - PAID TIER
- [ ] Offer submission form
- [ ] Offer dashboard for sellers
- [ ] Accept/reject/counter logic
- [ ] Offer comparison table
- [ ] Email/SMS notifications

### Phase 7: Messaging (Week 11) - PAID TIER
- [ ] Real-time messaging with Supabase Realtime
- [ ] Message threads
- [ ] File attachments
- [ ] Notification system

### Phase 8: Documents & E-Signatures (Weeks 12-13) - PAID TIER
- [ ] WA legal document templates
- [ ] Document generator
- [ ] DocuSign integration
- [ ] Document library and storage
- [ ] Signature tracking

### Phase 9: Transaction Management (Week 14) - PAID TIER
- [ ] Transaction dashboard
- [ ] Closing checklist
- [ ] Timeline tracker
- [ ] Title/escrow coordination

### Phase 10: Polish & Launch Prep (Weeks 15-16)
- [ ] Mobile optimization
- [ ] Performance optimization
- [ ] SEO enhancements
- [ ] Error tracking (Sentry)
- [ ] Analytics (PostHog)
- [ ] User testing and feedback
- [ ] Legal disclaimer pages
- [ ] Terms of Service & Privacy Policy
- [ ] Help center / FAQ
- [ ] Launch marketing site

---

## Success Metrics

### Year 1 Goals
- 500 active listings
- 100 paid transactions
- $50K revenue
- 4.5+ star average rating
- <5% churn rate

### User Satisfaction KPIs
- Listing creation completion rate >80%
- Time to first offer <14 days
- Transaction close rate >70%
- NPS score >50

---

## Competitive Advantages

### vs. Traditional FSBO Sites (Zillow FSBO, ForSaleByOwner.com)
✅ Modern, mobile-first UX
✅ Integrated transaction management
✅ WA-specific legal documents
✅ E-signature built-in
✅ No subscription required (pay per transaction)

### vs. Realtors
✅ Save 5-6% commission (~$30K on $500K home)
✅ Full control over process
✅ Direct buyer communication
✅ Complete transparency
✅ Professional tools at fraction of cost

### vs. Other FSBO Platforms
✅ State-specific legal compliance
✅ One platform from listing → closing
✅ Modern design (not built in 2010)
✅ Mobile-optimized
✅ Fair pricing (pay when you need features)

---

## Future Enhancements (Post-MVP)

- Mobile apps (iOS/Android)
- AI pricing recommendations
- Neighborhood comparison reports
- Automated showing booking (calendar sync)
- Integration with MLS (listing syndication)
- Service provider marketplace (photographers, stagers)
- Virtual staging (AI-powered)
- Comparative market analysis (CMA) generator
- Buyer pre-qualification tools
- Mortgage calculator with lender referrals
- Home warranty integration
- Moving services marketplace
- Multi-language support (Spanish)

---

## Technology Decisions Rationale

### Why Next.js 14?
- Server-side rendering for SEO
- API routes eliminate separate backend
- File-based routing simplifies structure
- Excellent TypeScript support
- Industry standard with great community

### Why Supabase?
- PostgreSQL (robust relational data)
- Built-in authentication
- Real-time subscriptions (messaging)
- File storage included
- Generous free tier
- Easy to scale

### Why Stripe?
- Industry-leading payment security
- Comprehensive API
- Subscription management built-in
- Excellent documentation
- Trusted brand

### Why DocuSign?
- Legal industry standard
- Comprehensive audit trail
- Mobile signing support
- Court-admissible signatures
- Enterprise-grade security

---

## Open Questions / Decisions Needed

1. **Legal Review**: Should we hire a WA real estate attorney to review document templates?
2. **Insurance**: Do we need E&O insurance as a platform facilitating transactions?
3. **MLS Access**: Do we want to pursue IDX integration for broader listing exposure?
4. **Branding**: Keep "AIRE" name or rebrand to something FSBO-specific? (e.g., "AIRE Homes", "AIRE FSBO")
5. **Customer Support**: Live chat, email-only, or phone support for paid users?
6. **Vendor Vetting**: What criteria for service provider marketplace (if building)?

---

## Launch Checklist

### Pre-Launch
- [ ] Complete Phases 1-9
- [ ] Legal review of terms, privacy policy, disclaimers
- [ ] Attorney review of document templates
- [ ] Security audit
- [ ] Load testing
- [ ] Beta user testing (10-20 sellers)
- [ ] Customer support system setup
- [ ] Knowledge base / FAQ creation

### Launch Day
- [ ] Deploy to production
- [ ] Set up monitoring and alerts
- [ ] Press release (local WA media)
- [ ] Social media announcement
- [ ] Email existing network (Amie's contacts)
- [ ] Launch Facebook/Instagram ads

### Post-Launch (Week 1)
- [ ] Daily monitoring of errors
- [ ] User feedback collection
- [ ] Rapid bug fixes
- [ ] Content marketing (blog posts)
- [ ] SEO optimization based on analytics

---

## Budget Estimate

### Development Costs (if outsourced)
- Full-stack developer (16 weeks @ $100/hr, 40hr/week): $64,000
- UI/UX designer (4 weeks @ $80/hr, 20hr/week): $6,400
- Legal review: $2,000
- **Total**: ~$72,400

### Monthly Operating Costs
- Vercel Pro: $20/month
- Supabase Pro: $25/month
- Supabase Storage: $10/month
- DocuSign (per envelope): $0.50/envelope
- Stripe fees: 2.9% + $0.30 per transaction
- Twilio SMS: $0.0075/message
- Resend Email: $20/month
- Domain: $15/year
- **Estimated**: $100-150/month + transaction fees

### Break-Even Analysis
- Fixed costs: ~$150/month = $1,800/year
- Need 4 paid transactions/month to break even ($499 × 4 = $1,996)
- Profit margin scales rapidly after break-even

---

**Document Version**: 1.0
**Last Updated**: 2025-11-17
**Status**: Ready for Development
