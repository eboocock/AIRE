-- AIRE Database Schema
-- Initial migration for the AI Real Estate Platform

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- For geographic queries

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE listing_status AS ENUM (
  'draft',
  'pending_review',
  'active',
  'under_contract',
  'sold',
  'withdrawn',
  'expired'
);

CREATE TYPE offer_status AS ENUM (
  'pending',
  'countered',
  'accepted',
  'rejected',
  'withdrawn',
  'expired'
);

CREATE TYPE showing_status AS ENUM (
  'requested',
  'confirmed',
  'completed',
  'cancelled',
  'no_show'
);

CREATE TYPE document_type AS ENUM (
  'listing_agreement',
  'seller_disclosure',
  'lead_paint_disclosure',
  'purchase_agreement',
  'counter_offer',
  'addendum',
  'inspection_report',
  'appraisal',
  'title_report',
  'closing_disclosure',
  'other'
);

CREATE TYPE document_status AS ENUM (
  'draft',
  'pending_signature',
  'signed',
  'expired',
  'voided'
);

CREATE TYPE user_role AS ENUM (
  'seller',
  'buyer',
  'admin'
);

-- ============================================
-- PROFILES (extends Supabase auth.users)
-- ============================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'seller',
  stripe_customer_id TEXT,
  email_verified BOOLEAN DEFAULT false,
  phone_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PROPERTIES / LISTINGS
-- ============================================

CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Address
  street_address TEXT NOT NULL,
  unit TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  county TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  location GEOGRAPHY(POINT, 4326), -- PostGIS for geo queries

  -- Property Details
  property_type TEXT DEFAULT 'single_family', -- single_family, condo, townhouse, etc.
  beds INTEGER,
  baths DECIMAL(3, 1),
  sqft INTEGER,
  lot_size DECIMAL(10, 2), -- in acres
  year_built INTEGER,
  stories INTEGER,
  garage_spaces INTEGER,

  -- Pricing
  list_price INTEGER,
  ai_estimated_value INTEGER,
  ai_value_low INTEGER,
  ai_value_high INTEGER,
  ai_confidence_score INTEGER, -- 0-100
  price_per_sqft INTEGER,

  -- Listing Content
  headline TEXT,
  description TEXT,
  ai_generated_description TEXT,
  features JSONB DEFAULT '[]', -- Array of feature strings

  -- Status & Dates
  status listing_status DEFAULT 'draft',
  listed_at TIMESTAMPTZ,
  under_contract_at TIMESTAMPTZ,
  sold_at TIMESTAMPTZ,
  sold_price INTEGER,
  days_on_market INTEGER,

  -- MLS
  mls_number TEXT UNIQUE,
  mls_listed BOOLEAN DEFAULT false,

  -- Analytics
  view_count INTEGER DEFAULT 0,
  save_count INTEGER DEFAULT 0,
  inquiry_count INTEGER DEFAULT 0,
  showing_count INTEGER DEFAULT 0,

  -- Metadata
  imported_from TEXT, -- 'zillow', 'redfin', 'manual', etc.
  imported_data JSONB, -- Raw data from import

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for geographic queries
CREATE INDEX listings_location_idx ON listings USING GIST (location);
CREATE INDEX listings_status_idx ON listings (status);
CREATE INDEX listings_seller_idx ON listings (seller_id);
CREATE INDEX listings_zip_idx ON listings (zip_code);

-- ============================================
-- LISTING PHOTOS
-- ============================================

CREATE TABLE listing_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL, -- Supabase storage path
  url TEXT NOT NULL,
  caption TEXT,
  room_type TEXT, -- 'exterior', 'living_room', 'kitchen', etc.
  is_primary BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX listing_photos_listing_idx ON listing_photos (listing_id);

-- ============================================
-- OFFERS
-- ============================================

CREATE TABLE offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES profiles(id), -- NULL if unregistered buyer

  -- Buyer Info (for unregistered buyers)
  buyer_name TEXT,
  buyer_email TEXT,
  buyer_phone TEXT,
  buyer_agent_name TEXT,
  buyer_agent_email TEXT,
  buyer_agent_phone TEXT,

  -- Offer Terms
  offer_price INTEGER NOT NULL,
  earnest_money INTEGER,
  down_payment_percent DECIMAL(5, 2),
  financing_type TEXT, -- 'cash', 'conventional', 'fha', 'va', etc.
  pre_approval_amount INTEGER,

  -- Contingencies
  inspection_contingency BOOLEAN DEFAULT true,
  inspection_days INTEGER DEFAULT 10,
  financing_contingency BOOLEAN DEFAULT true,
  financing_days INTEGER DEFAULT 21,
  appraisal_contingency BOOLEAN DEFAULT true,
  sale_contingency BOOLEAN DEFAULT false,
  sale_contingency_address TEXT,

  -- Timeline
  closing_date DATE,
  possession_date DATE,

  -- Additional Terms
  additional_terms TEXT,

  -- Status
  status offer_status DEFAULT 'pending',
  counter_offer_id UUID REFERENCES offers(id), -- Reference to counter

  -- AI Analysis
  ai_strength_score INTEGER, -- 0-100
  ai_analysis JSONB, -- AI evaluation of offer

  -- Timestamps
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  responded_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX offers_listing_idx ON offers (listing_id);
CREATE INDEX offers_buyer_idx ON offers (buyer_id);
CREATE INDEX offers_status_idx ON offers (status);

-- ============================================
-- SHOWINGS
-- ============================================

CREATE TABLE showings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES profiles(id),

  -- Buyer Info
  buyer_name TEXT NOT NULL,
  buyer_email TEXT,
  buyer_phone TEXT,
  buyer_agent_name TEXT,

  -- Scheduling
  requested_date DATE NOT NULL,
  requested_time_start TIME NOT NULL,
  requested_time_end TIME,
  confirmed_date DATE,
  confirmed_time_start TIME,
  confirmed_time_end TIME,

  -- Status
  status showing_status DEFAULT 'requested',

  -- Feedback
  buyer_feedback TEXT,
  buyer_rating INTEGER, -- 1-5
  interested BOOLEAN,

  -- Lockbox
  lockbox_code TEXT,
  access_instructions TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX showings_listing_idx ON showings (listing_id);
CREATE INDEX showings_date_idx ON showings (requested_date);

-- ============================================
-- DOCUMENTS
-- ============================================

CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  offer_id UUID REFERENCES offers(id) ON DELETE SET NULL,

  -- Document Info
  name TEXT NOT NULL,
  document_type document_type NOT NULL,
  description TEXT,

  -- Storage
  storage_path TEXT NOT NULL,
  url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,

  -- E-Signature
  status document_status DEFAULT 'draft',
  requires_signature BOOLEAN DEFAULT false,
  signature_provider TEXT, -- 'docusign', 'hellosign', etc.
  signature_envelope_id TEXT,
  signed_at TIMESTAMPTZ,
  signed_by JSONB DEFAULT '[]', -- Array of signer info

  -- AI Generated
  ai_generated BOOLEAN DEFAULT false,
  ai_template_used TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX documents_listing_idx ON documents (listing_id);
CREATE INDEX documents_offer_idx ON documents (offer_id);

-- ============================================
-- MESSAGES / INQUIRIES
-- ============================================

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id),
  recipient_id UUID REFERENCES profiles(id),

  -- For unregistered senders
  sender_name TEXT,
  sender_email TEXT,
  sender_phone TEXT,

  -- Message
  subject TEXT,
  body TEXT NOT NULL,

  -- Status
  read_at TIMESTAMPTZ,
  replied_at TIMESTAMPTZ,

  -- AI
  ai_suggested_reply TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX messages_listing_idx ON messages (listing_id);
CREATE INDEX messages_recipient_idx ON messages (recipient_id);

-- ============================================
-- SAVED LISTINGS (for buyers)
-- ============================================

CREATE TABLE saved_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

-- ============================================
-- PROPERTY ANALYTICS
-- ============================================

CREATE TABLE listing_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'view', 'save', 'share', 'inquiry', etc.
  user_id UUID REFERENCES profiles(id),
  session_id TEXT,
  referrer TEXT,
  device_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX listing_analytics_listing_idx ON listing_analytics (listing_id);
CREATE INDEX listing_analytics_created_idx ON listing_analytics (created_at);

-- ============================================
-- PAYMENTS / TRANSACTIONS
-- ============================================

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id),

  -- Stripe
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_charge_id TEXT,

  -- Amount
  amount INTEGER NOT NULL, -- in cents
  currency TEXT DEFAULT 'usd',

  -- Status
  status TEXT NOT NULL, -- 'pending', 'succeeded', 'failed', 'refunded'

  -- Type
  transaction_type TEXT NOT NULL, -- 'listing_fee', 'premium_feature', 'refund'
  description TEXT,

  -- Metadata
  metadata JSONB,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX transactions_listing_idx ON transactions (listing_id);
CREATE INDEX transactions_user_idx ON transactions (user_id);

-- ============================================
-- AI VALUATIONS (cached)
-- ============================================

CREATE TABLE ai_valuations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Address (for non-listing valuations)
  street_address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,

  -- Results
  estimated_value INTEGER,
  value_low INTEGER,
  value_high INTEGER,
  confidence_score INTEGER,
  price_per_sqft INTEGER,

  -- Property Info (fetched)
  property_data JSONB,
  comparables JSONB,
  market_data JSONB,

  -- AI Content
  listing_description TEXT,
  improvements JSONB,

  -- Sources
  data_sources JSONB,

  -- Cache
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX ai_valuations_address_idx ON ai_valuations (street_address, city, state);
CREATE INDEX ai_valuations_expires_idx ON ai_valuations (expires_at);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE showings ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all, update own
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Listings: Public read for active, owners can do anything
CREATE POLICY "Active listings are public" ON listings
  FOR SELECT USING (status = 'active' OR seller_id = auth.uid());
CREATE POLICY "Sellers can manage own listings" ON listings
  FOR ALL USING (seller_id = auth.uid());

-- Photos: Same as listings
CREATE POLICY "Photos follow listing visibility" ON listing_photos
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM listings WHERE id = listing_id AND (status = 'active' OR seller_id = auth.uid()))
  );
CREATE POLICY "Sellers can manage listing photos" ON listing_photos
  FOR ALL USING (
    EXISTS (SELECT 1 FROM listings WHERE id = listing_id AND seller_id = auth.uid())
  );

-- Offers: Visible to listing owner and offer maker
CREATE POLICY "Offers visible to participants" ON offers
  FOR SELECT USING (
    buyer_id = auth.uid() OR
    EXISTS (SELECT 1 FROM listings WHERE id = listing_id AND seller_id = auth.uid())
  );
CREATE POLICY "Buyers can create offers" ON offers
  FOR INSERT WITH CHECK (buyer_id = auth.uid() OR buyer_id IS NULL);
CREATE POLICY "Participants can update offers" ON offers
  FOR UPDATE USING (
    buyer_id = auth.uid() OR
    EXISTS (SELECT 1 FROM listings WHERE id = listing_id AND seller_id = auth.uid())
  );

-- Showings: Similar to offers
CREATE POLICY "Showings visible to participants" ON showings
  FOR SELECT USING (
    buyer_id = auth.uid() OR
    EXISTS (SELECT 1 FROM listings WHERE id = listing_id AND seller_id = auth.uid())
  );
CREATE POLICY "Anyone can request showings" ON showings
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Participants can update showings" ON showings
  FOR UPDATE USING (
    buyer_id = auth.uid() OR
    EXISTS (SELECT 1 FROM listings WHERE id = listing_id AND seller_id = auth.uid())
  );

-- Documents: Visible to listing participants
CREATE POLICY "Documents visible to participants" ON documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE id = listing_id
      AND (seller_id = auth.uid() OR EXISTS (
        SELECT 1 FROM offers WHERE listing_id = listings.id AND buyer_id = auth.uid()
      ))
    )
  );

-- Messages: Visible to sender/recipient
CREATE POLICY "Messages visible to participants" ON messages
  FOR SELECT USING (sender_id = auth.uid() OR recipient_id = auth.uid());
CREATE POLICY "Anyone can send messages" ON messages
  FOR INSERT WITH CHECK (true);

-- Saved listings: Users manage own
CREATE POLICY "Users manage own saved listings" ON saved_listings
  FOR ALL USING (user_id = auth.uid());

-- Transactions: Users see own
CREATE POLICY "Users see own transactions" ON transactions
  FOR SELECT USING (user_id = auth.uid());

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Update updated_at on row changes
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER listings_updated_at BEFORE UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER offers_updated_at BEFORE UPDATE ON offers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER showings_updated_at BEFORE UPDATE ON showings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER documents_updated_at BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update listing location from lat/lng
CREATE OR REPLACE FUNCTION update_listing_location()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
    NEW.location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER listings_location_update
  BEFORE INSERT OR UPDATE OF latitude, longitude ON listings
  FOR EACH ROW EXECUTE FUNCTION update_listing_location();

-- Calculate days on market
CREATE OR REPLACE FUNCTION update_days_on_market()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'active' AND NEW.listed_at IS NOT NULL THEN
    NEW.days_on_market = EXTRACT(DAY FROM NOW() - NEW.listed_at)::INTEGER;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER listings_dom_update
  BEFORE UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION update_days_on_market();
