# Supabase Setup for AIRE FSBO Platform

This directory contains database migrations and configuration for the AIRE FSBO Platform.

## Prerequisites

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose a name (e.g., "aire-fsbo-production")
   - Set a strong database password
   - Choose a region close to your users (e.g., US West)

2. **Get Your Project Credentials**
   - Project URL: `https://[your-project-id].supabase.co`
   - Anon (public) key: Found in Settings > API
   - Service role key: Found in Settings > API (keep this secret!)

## Setup Instructions

### Method 1: Using Supabase CLI (Recommended)

1. **Install Supabase CLI**
   ```bash
   npm install -g supabase
   ```

2. **Link to Your Project**
   ```bash
   supabase link --project-ref [your-project-id]
   ```

3. **Run Migrations**
   ```bash
   supabase db push
   ```

### Method 2: Manual SQL Execution

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy the contents of `migrations/20250101000000_initial_schema.sql`
4. Paste into the SQL Editor
5. Click "Run"

## Database Schema Overview

### Core Tables

#### `users`
- Stores user profiles (sellers and buyers)
- Links to Supabase Auth
- Tracks subscription status
- Contains notification preferences

#### `listings`
- Property listings with full details
- Includes address, property info, features
- Photos and media stored as JSONB
- SEO-optimized with slugs
- Analytics tracking (views, favorites, inquiries)

#### `listing_access`
- Tracks paid tier unlocks per listing
- One-to-one relationship with listings
- Records Stripe payment details

#### `offers`
- Buyer offers on listings
- Includes price, terms, contingencies
- Tracks financing details
- Supports counter-offers

#### `messages`
- Secure messaging between buyers and sellers
- Links to listings and offers
- Read receipts

#### `documents`
- Legal documents and attachments
- DocuSign integration tracking
- Signature status
- Washington State specific forms

#### `showings`
- Property showing requests
- Scheduling and confirmation
- Status tracking

#### `transactions`
- Active deals from acceptance to close
- Closing coordination
- Task checklist
- Important dates tracking

#### `favorites`
- User saved listings
- For buyers to track interested properties

#### `notifications`
- In-app notifications
- Links to relevant entities
- Read/unread status

## Environment Variables

Add these to your `.env.local` file:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[your-project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## Row Level Security (RLS)

The schema includes RLS policies to ensure:
- Users can only access their own data
- Published listings are publicly viewable
- Sellers can manage their own listings
- Buyers can only see their own offers
- Messages are private between sender and recipient

## Storage Buckets

You'll also need to create these storage buckets in Supabase:

1. **listing-photos**
   - Public bucket
   - For property images
   - Max file size: 10MB

2. **documents**
   - Private bucket
   - For legal documents
   - Max file size: 25MB

3. **avatars**
   - Public bucket
   - For user profile pictures
   - Max file size: 2MB

### Creating Buckets

1. Go to Storage in Supabase Dashboard
2. Click "New Bucket"
3. Set name and public/private setting
4. Configure file size limits

### Storage Policies

For `listing-photos` bucket:
```sql
-- Allow public read access
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'listing-photos');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'listing-photos' AND
    auth.role() = 'authenticated'
  );
```

For `documents` bucket:
```sql
-- Only allow users to read their own documents
CREATE POLICY "User read own documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

## Authentication Setup

### Enable Auth Providers

In Supabase Dashboard → Authentication → Providers:

1. **Email** (Enabled by default)
   - Confirm email: Enable
   - Secure email change: Enable

2. **Google OAuth**
   - Get credentials from Google Cloud Console
   - Add authorized redirect URI: `https://[your-project-id].supabase.co/auth/v1/callback`

3. **Facebook OAuth** (Optional)
   - Get App ID and Secret from Facebook Developers
   - Add authorized redirect URI

### Email Templates

Customize email templates in Authentication → Email Templates:
- Confirmation email
- Reset password email
- Magic link email

Use your brand colors and AIRE branding.

## Testing the Schema

After running migrations, test with these queries:

```sql
-- Create a test user (do this after signing up through the app)
SELECT * FROM public.users LIMIT 1;

-- Create a test listing
INSERT INTO public.listings (
  user_id,
  address_line1,
  city,
  state,
  zip_code,
  property_type,
  bedrooms,
  bathrooms,
  sqft,
  price,
  description
) VALUES (
  '[user-uuid]',
  '123 Main St',
  'Seattle',
  'WA',
  '98101',
  'single_family',
  3,
  2.5,
  2000,
  500000,
  'Beautiful home in Seattle'
);

-- Query listings
SELECT id, address_line1, city, price, status
FROM public.listings
WHERE status = 'active';
```

## Backup and Maintenance

### Backups

Supabase automatically backs up your database:
- Free tier: Daily backups, 7 days retention
- Pro tier: Daily backups, 30 days retention

### Manual Backup

```bash
# Export entire database
supabase db dump > backup.sql

# Restore from backup
psql [connection-string] < backup.sql
```

## Troubleshooting

### Common Issues

1. **RLS Preventing Access**
   - Check policies with `SELECT * FROM pg_policies;`
   - Ensure user is authenticated
   - Verify user_id matches auth_user_id

2. **Slow Queries**
   - Check query performance in Supabase Dashboard → Database → Query Performance
   - Ensure indexes are created
   - Use `EXPLAIN ANALYZE` for complex queries

3. **Migration Errors**
   - Drop test data before re-running migrations
   - Check for conflicting type names
   - Ensure extensions are enabled

## Next Steps

1. ✅ Run initial schema migration
2. ⬜ Create storage buckets
3. ⬜ Configure authentication providers
4. ⬜ Test database with sample data
5. ⬜ Set up connection in Next.js app
6. ⬜ Test RLS policies
7. ⬜ Set up automated backups
8. ⬜ Configure database webhooks (optional)

## Support

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- AIRE Platform Issues: [Your GitHub Repo]

---

**Security Note**: Never commit your `.env.local` file or share your service role key publicly. The service role key bypasses RLS and should only be used in secure server environments.
