-- AIRE FSBO Platform - Initial Database Schema
-- Washington State FSBO Complete Solution
-- Version: 1.0
-- Created: 2025-11-17

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_type AS ENUM ('seller', 'buyer', 'both');
CREATE TYPE subscription_status AS ENUM ('free', 'active', 'cancelled', 'expired');
CREATE TYPE listing_status AS ENUM ('draft', 'active', 'pending', 'sold', 'expired', 'cancelled');
CREATE TYPE property_type AS ENUM ('single_family', 'condo', 'townhouse', 'multi_family', 'land', 'mobile', 'other');
CREATE TYPE offer_status AS ENUM ('pending', 'viewed', 'accepted', 'rejected', 'countered', 'expired', 'withdrawn');
CREATE TYPE financing_type AS ENUM ('conventional', 'fha', 'va', 'usda', 'cash', 'other');
CREATE TYPE document_type AS ENUM ('disclosure', 'purchase_agreement', 'addendum', 'inspection', 'pre_approval', 'earnest_money', 'closing', 'other');
CREATE TYPE showing_status AS ENUM ('requested', 'confirmed', 'cancelled', 'completed', 'no_show');
CREATE TYPE transaction_status AS ENUM ('under_contract', 'inspection', 'appraisal', 'financing', 'final_walkthrough', 'closing', 'closed', 'cancelled');

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- Auth (links to Supabase auth.users)
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,

    -- Profile
    full_name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    user_type user_type DEFAULT 'seller',

    -- Subscription
    subscription_status subscription_status DEFAULT 'free',
    stripe_customer_id TEXT,

    -- Settings
    email_notifications BOOLEAN DEFAULT true,
    sms_notifications BOOLEAN DEFAULT true,
    marketing_emails BOOLEAN DEFAULT true,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for users
CREATE INDEX idx_users_auth_user_id ON public.users(auth_user_id);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_subscription_status ON public.users(subscription_status);

-- ============================================
-- LISTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    status listing_status DEFAULT 'draft',

    -- Property Address
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL DEFAULT 'WA',
    zip_code TEXT NOT NULL,
    county TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),

    -- Property Details
    property_type property_type NOT NULL,
    bedrooms INTEGER NOT NULL,
    bathrooms DECIMAL(3, 1) NOT NULL,
    sqft INTEGER,
    lot_size DECIMAL(10, 2),
    year_built INTEGER,

    -- Property Features
    parking_spaces INTEGER,
    garage_spaces INTEGER,
    has_ac BOOLEAN DEFAULT false,
    has_heating BOOLEAN DEFAULT true,
    heating_type TEXT,
    has_fireplace BOOLEAN DEFAULT false,
    has_pool BOOLEAN DEFAULT false,
    has_basement BOOLEAN DEFAULT false,
    hoa_fee DECIMAL(10, 2),
    property_tax DECIMAL(10, 2),
    features JSONB DEFAULT '[]'::jsonb,

    -- Listing Details
    price DECIMAL(12, 2) NOT NULL,
    title TEXT,
    description TEXT,

    -- Media
    photos JSONB DEFAULT '[]'::jsonb, -- [{url, order, caption}]
    video_url TEXT,
    virtual_tour_url TEXT,

    -- SEO & Marketing
    slug TEXT UNIQUE,
    meta_title TEXT,
    meta_description TEXT,

    -- Analytics
    views INTEGER DEFAULT 0,
    favorites INTEGER DEFAULT 0,
    inquiries INTEGER DEFAULT 0,
    showing_requests INTEGER DEFAULT 0,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '90 days'),

    -- Constraints
    CONSTRAINT valid_price CHECK (price > 0),
    CONSTRAINT valid_bedrooms CHECK (bedrooms >= 0),
    CONSTRAINT valid_bathrooms CHECK (bathrooms >= 0)
);

-- Create indexes for listings
CREATE INDEX idx_listings_user_id ON public.listings(user_id);
CREATE INDEX idx_listings_status ON public.listings(status);
CREATE INDEX idx_listings_city ON public.listings(city);
CREATE INDEX idx_listings_price ON public.listings(price);
CREATE INDEX idx_listings_property_type ON public.listings(property_type);
CREATE INDEX idx_listings_bedrooms ON public.listings(bedrooms);
CREATE INDEX idx_listings_bathrooms ON public.listings(bathrooms);
CREATE INDEX idx_listings_published_at ON public.listings(published_at);
CREATE INDEX idx_listings_slug ON public.listings(slug);

-- Full-text search index for listings
CREATE INDEX idx_listings_search ON public.listings
    USING gin(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(address_line1, '') || ' ' || coalesce(city, '')));

-- ============================================
-- LISTING ACCESS (Paid Tier Tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS public.listing_access (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
    transaction_unlocked BOOLEAN DEFAULT false,
    unlocked_at TIMESTAMP WITH TIME ZONE,

    -- Payment Info
    stripe_payment_intent_id TEXT,
    amount_paid DECIMAL(10, 2),

    -- Features Unlocked
    offers_enabled BOOLEAN DEFAULT false,
    messaging_enabled BOOLEAN DEFAULT false,
    documents_enabled BOOLEAN DEFAULT false,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraints
    UNIQUE(listing_id)
);

-- Create index
CREATE INDEX idx_listing_access_listing_id ON public.listing_access(listing_id);

-- ============================================
-- OFFERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
    buyer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    status offer_status DEFAULT 'pending',

    -- Offer Details
    offer_price DECIMAL(12, 2) NOT NULL,
    earnest_money DECIMAL(10, 2),
    down_payment_percent DECIMAL(5, 2),

    -- Financing
    financing_type financing_type NOT NULL,
    pre_approval_url TEXT,
    lender_name TEXT,
    lender_contact TEXT,

    -- Terms
    closing_date DATE,
    possession_date DATE,
    inspection_contingency BOOLEAN DEFAULT true,
    inspection_days INTEGER DEFAULT 10,
    financing_contingency BOOLEAN DEFAULT true,
    financing_days INTEGER DEFAULT 21,
    appraisal_contingency BOOLEAN DEFAULT true,
    sale_of_home_contingency BOOLEAN DEFAULT false,
    other_contingencies TEXT,

    -- Messages
    buyer_message TEXT,
    seller_response TEXT,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '3 days'),
    viewed_at TIMESTAMP WITH TIME ZONE,
    responded_at TIMESTAMP WITH TIME ZONE,

    -- Constraints
    CONSTRAINT valid_offer_price CHECK (offer_price > 0),
    CONSTRAINT valid_down_payment CHECK (down_payment_percent >= 0 AND down_payment_percent <= 100)
);

-- Create indexes for offers
CREATE INDEX idx_offers_listing_id ON public.offers(listing_id);
CREATE INDEX idx_offers_buyer_id ON public.offers(buyer_id);
CREATE INDEX idx_offers_status ON public.offers(status);
CREATE INDEX idx_offers_created_at ON public.offers(created_at);

-- ============================================
-- MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
    offer_id UUID REFERENCES public.offers(id) ON DELETE SET NULL,
    sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,

    -- Message Content
    subject TEXT,
    content TEXT NOT NULL,
    attachment_url TEXT,

    -- Status
    read_at TIMESTAMP WITH TIME ZONE,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for messages
CREATE INDEX idx_messages_listing_id ON public.messages(listing_id);
CREATE INDEX idx_messages_offer_id ON public.messages(offer_id);
CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON public.messages(recipient_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at);

-- ============================================
-- DOCUMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
    offer_id UUID REFERENCES public.offers(id) ON DELETE SET NULL,
    document_type document_type NOT NULL,

    -- Document Info
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,

    -- Signature Tracking
    requires_signature BOOLEAN DEFAULT false,
    docusign_envelope_id TEXT,
    signed_by JSONB DEFAULT '[]'::jsonb, -- [{user_id, signed_at}]
    fully_signed BOOLEAN DEFAULT false,
    signed_at TIMESTAMP WITH TIME ZONE,

    -- Upload Info
    created_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for documents
CREATE INDEX idx_documents_listing_id ON public.documents(listing_id);
CREATE INDEX idx_documents_offer_id ON public.documents(offer_id);
CREATE INDEX idx_documents_document_type ON public.documents(document_type);
CREATE INDEX idx_documents_created_by ON public.documents(created_by);

-- ============================================
-- SHOWINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.showings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
    buyer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,

    -- Showing Details
    requested_date DATE NOT NULL,
    requested_time TIME NOT NULL,
    requested_time_end TIME,
    status showing_status DEFAULT 'requested',

    -- Contact Info
    buyer_name TEXT NOT NULL,
    buyer_phone TEXT NOT NULL,
    buyer_email TEXT NOT NULL,

    -- Notes
    buyer_notes TEXT,
    seller_notes TEXT,

    -- Confirmation
    confirmed_by UUID REFERENCES public.users(id),
    confirmed_at TIMESTAMP WITH TIME ZONE,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for showings
CREATE INDEX idx_showings_listing_id ON public.showings(listing_id);
CREATE INDEX idx_showings_buyer_id ON public.showings(buyer_id);
CREATE INDEX idx_showings_status ON public.showings(status);
CREATE INDEX idx_showings_requested_date ON public.showings(requested_date);

-- ============================================
-- TRANSACTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    buyer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    accepted_offer_id UUID NOT NULL REFERENCES public.offers(id) ON DELETE CASCADE,

    -- Transaction Status
    status transaction_status DEFAULT 'under_contract',

    -- Important Dates
    contract_date DATE NOT NULL,
    closing_date DATE NOT NULL,
    possession_date DATE,

    -- Financial
    sale_price DECIMAL(12, 2) NOT NULL,
    earnest_money DECIMAL(10, 2),

    -- Closing Details
    title_company TEXT,
    escrow_number TEXT,
    closing_agent_name TEXT,
    closing_agent_email TEXT,
    closing_agent_phone TEXT,

    -- Checklist
    checklist JSONB DEFAULT '[]'::jsonb, -- [{task, completed, due_date}]

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    closed_at TIMESTAMP WITH TIME ZONE,

    -- Constraints
    CONSTRAINT valid_sale_price CHECK (sale_price > 0),
    CONSTRAINT valid_closing_date CHECK (closing_date >= contract_date)
);

-- Create indexes for transactions
CREATE INDEX idx_transactions_listing_id ON public.transactions(listing_id);
CREATE INDEX idx_transactions_seller_id ON public.transactions(seller_id);
CREATE INDEX idx_transactions_buyer_id ON public.transactions(buyer_id);
CREATE INDEX idx_transactions_status ON public.transactions(status);
CREATE INDEX idx_transactions_closing_date ON public.transactions(closing_date);

-- ============================================
-- FAVORITES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraints
    UNIQUE(user_id, listing_id)
);

-- Create indexes for favorites
CREATE INDEX idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX idx_favorites_listing_id ON public.favorites(listing_id);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,

    -- Notification Details
    type TEXT NOT NULL, -- 'offer', 'message', 'showing', 'document', etc.
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,

    -- Related Entities
    listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
    offer_id UUID REFERENCES public.offers(id) ON DELETE CASCADE,
    message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,

    -- Status
    read_at TIMESTAMP WITH TIME ZONE,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for notifications
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read_at ON public.notifications(read_at);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at);

-- ============================================
-- TRIGGERS FOR updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON public.listings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_listing_access_updated_at BEFORE UPDATE ON public.listing_access
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_offers_updated_at BEFORE UPDATE ON public.offers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_showings_updated_at BEFORE UPDATE ON public.showings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.showings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = auth_user_id);

-- Listings policies
CREATE POLICY "Anyone can view published listings" ON public.listings
    FOR SELECT USING (status = 'active' OR status = 'pending' OR status = 'sold');

CREATE POLICY "Sellers can view own listings" ON public.listings
    FOR SELECT USING (auth.uid() = (SELECT auth_user_id FROM public.users WHERE id = user_id));

CREATE POLICY "Sellers can create listings" ON public.listings
    FOR INSERT WITH CHECK (auth.uid() = (SELECT auth_user_id FROM public.users WHERE id = user_id));

CREATE POLICY "Sellers can update own listings" ON public.listings
    FOR UPDATE USING (auth.uid() = (SELECT auth_user_id FROM public.users WHERE id = user_id));

CREATE POLICY "Sellers can delete own listings" ON public.listings
    FOR DELETE USING (auth.uid() = (SELECT auth_user_id FROM public.users WHERE id = user_id));

-- Listing Access policies
CREATE POLICY "Sellers can view own listing access" ON public.listing_access
    FOR SELECT USING (
        auth.uid() = (
            SELECT u.auth_user_id
            FROM public.users u
            JOIN public.listings l ON l.user_id = u.id
            WHERE l.id = listing_id
        )
    );

-- Offers policies
CREATE POLICY "Sellers can view offers on their listings" ON public.offers
    FOR SELECT USING (
        auth.uid() = (
            SELECT u.auth_user_id
            FROM public.users u
            JOIN public.listings l ON l.user_id = u.id
            WHERE l.id = listing_id
        )
    );

CREATE POLICY "Buyers can view their own offers" ON public.offers
    FOR SELECT USING (auth.uid() = (SELECT auth_user_id FROM public.users WHERE id = buyer_id));

CREATE POLICY "Buyers can create offers" ON public.offers
    FOR INSERT WITH CHECK (auth.uid() = (SELECT auth_user_id FROM public.users WHERE id = buyer_id));

-- Messages policies
CREATE POLICY "Users can view messages they sent or received" ON public.messages
    FOR SELECT USING (
        auth.uid() = (SELECT auth_user_id FROM public.users WHERE id = sender_id) OR
        auth.uid() = (SELECT auth_user_id FROM public.users WHERE id = recipient_id)
    );

-- Additional policies for other tables follow similar patterns...

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to increment listing views
CREATE OR REPLACE FUNCTION increment_listing_views(listing_id_param UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.listings
    SET views = views + 1
    WHERE id = listing_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate listing slug
CREATE OR REPLACE FUNCTION generate_listing_slug(city_param TEXT, address_param TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN lower(
        regexp_replace(
            city_param || '-' || address_param,
            '[^a-zA-Z0-9]+',
            '-',
            'g'
        )
    );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================
-- INITIAL DATA / SEED
-- ============================================

-- Create a default admin/test user if needed
-- This would typically be done separately

COMMENT ON TABLE public.users IS 'Users table storing both sellers and buyers';
COMMENT ON TABLE public.listings IS 'Property listings for FSBO sales';
COMMENT ON TABLE public.listing_access IS 'Tracks which listings have unlocked paid features';
COMMENT ON TABLE public.offers IS 'Buyer offers on listings';
COMMENT ON TABLE public.messages IS 'Messages between buyers and sellers';
COMMENT ON TABLE public.documents IS 'Legal documents and attachments';
COMMENT ON TABLE public.showings IS 'Property showing requests and scheduling';
COMMENT ON TABLE public.transactions IS 'Active real estate transactions from offer to close';
COMMENT ON TABLE public.favorites IS 'User saved/favorited listings';
COMMENT ON TABLE public.notifications IS 'In-app notifications for users';
