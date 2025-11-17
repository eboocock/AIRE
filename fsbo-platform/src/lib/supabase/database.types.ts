/**
 * Database Types for AIRE FSBO Platform
 *
 * To generate types from your Supabase database:
 * 1. Install Supabase CLI: npm install -g supabase
 * 2. Link your project: supabase link --project-ref [your-project-id]
 * 3. Generate types: supabase gen types typescript --local > src/lib/supabase/database.types.ts
 *
 * Or use: npx supabase gen types typescript --project-id [your-project-id] --schema public
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          auth_user_id: string | null
          email: string
          full_name: string
          phone: string | null
          avatar_url: string | null
          user_type: 'seller' | 'buyer' | 'both'
          subscription_status: 'free' | 'active' | 'cancelled' | 'expired'
          stripe_customer_id: string | null
          email_notifications: boolean
          sms_notifications: boolean
          marketing_emails: boolean
          created_at: string
          updated_at: string
          last_login_at: string | null
        }
        Insert: {
          id?: string
          auth_user_id?: string | null
          email: string
          full_name: string
          phone?: string | null
          avatar_url?: string | null
          user_type?: 'seller' | 'buyer' | 'both'
          subscription_status?: 'free' | 'active' | 'cancelled' | 'expired'
          stripe_customer_id?: string | null
          email_notifications?: boolean
          sms_notifications?: boolean
          marketing_emails?: boolean
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
        }
        Update: {
          id?: string
          auth_user_id?: string | null
          email?: string
          full_name?: string
          phone?: string | null
          avatar_url?: string | null
          user_type?: 'seller' | 'buyer' | 'both'
          subscription_status?: 'free' | 'active' | 'cancelled' | 'expired'
          stripe_customer_id?: string | null
          email_notifications?: boolean
          sms_notifications?: boolean
          marketing_emails?: boolean
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
        }
      }
      listings: {
        Row: {
          id: string
          user_id: string
          status: 'draft' | 'active' | 'pending' | 'sold' | 'expired' | 'cancelled'
          address_line1: string
          address_line2: string | null
          city: string
          state: string
          zip_code: string
          county: string | null
          latitude: number | null
          longitude: number | null
          property_type: 'single_family' | 'condo' | 'townhouse' | 'multi_family' | 'land' | 'mobile' | 'other'
          bedrooms: number
          bathrooms: number
          sqft: number | null
          lot_size: number | null
          year_built: number | null
          parking_spaces: number | null
          garage_spaces: number | null
          has_ac: boolean
          has_heating: boolean
          heating_type: string | null
          has_fireplace: boolean
          has_pool: boolean
          has_basement: boolean
          hoa_fee: number | null
          property_tax: number | null
          features: Json
          price: number
          title: string | null
          description: string | null
          photos: Json
          video_url: string | null
          virtual_tour_url: string | null
          slug: string | null
          meta_title: string | null
          meta_description: string | null
          views: number
          favorites: number
          inquiries: number
          showing_requests: number
          created_at: string
          updated_at: string
          published_at: string | null
          expires_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          status?: 'draft' | 'active' | 'pending' | 'sold' | 'expired' | 'cancelled'
          address_line1: string
          address_line2?: string | null
          city: string
          state?: string
          zip_code: string
          county?: string | null
          latitude?: number | null
          longitude?: number | null
          property_type: 'single_family' | 'condo' | 'townhouse' | 'multi_family' | 'land' | 'mobile' | 'other'
          bedrooms: number
          bathrooms: number
          sqft?: number | null
          lot_size?: number | null
          year_built?: number | null
          parking_spaces?: number | null
          garage_spaces?: number | null
          has_ac?: boolean
          has_heating?: boolean
          heating_type?: string | null
          has_fireplace?: boolean
          has_pool?: boolean
          has_basement?: boolean
          hoa_fee?: number | null
          property_tax?: number | null
          features?: Json
          price: number
          title?: string | null
          description?: string | null
          photos?: Json
          video_url?: string | null
          virtual_tour_url?: string | null
          slug?: string | null
          meta_title?: string | null
          meta_description?: string | null
          views?: number
          favorites?: number
          inquiries?: number
          showing_requests?: number
          created_at?: string
          updated_at?: string
          published_at?: string | null
          expires_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          status?: 'draft' | 'active' | 'pending' | 'sold' | 'expired' | 'cancelled'
          address_line1?: string
          address_line2?: string | null
          city?: string
          state?: string
          zip_code?: string
          county?: string | null
          latitude?: number | null
          longitude?: number | null
          property_type?: 'single_family' | 'condo' | 'townhouse' | 'multi_family' | 'land' | 'mobile' | 'other'
          bedrooms?: number
          bathrooms?: number
          sqft?: number | null
          lot_size?: number | null
          year_built?: number | null
          parking_spaces?: number | null
          garage_spaces?: number | null
          has_ac?: boolean
          has_heating?: boolean
          heating_type?: string | null
          has_fireplace?: boolean
          has_pool?: boolean
          has_basement?: boolean
          hoa_fee?: number | null
          property_tax?: number | null
          features?: Json
          price?: number
          title?: string | null
          description?: string | null
          photos?: Json
          video_url?: string | null
          virtual_tour_url?: string | null
          slug?: string | null
          meta_title?: string | null
          meta_description?: string | null
          views?: number
          favorites?: number
          inquiries?: number
          showing_requests?: number
          created_at?: string
          updated_at?: string
          published_at?: string | null
          expires_at?: string | null
        }
      }
      // Add other table types as needed
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_listing_views: {
        Args: { listing_id_param: string }
        Returns: void
      }
      generate_listing_slug: {
        Args: { city_param: string; address_param: string }
        Returns: string
      }
    }
    Enums: {
      user_type: 'seller' | 'buyer' | 'both'
      subscription_status: 'free' | 'active' | 'cancelled' | 'expired'
      listing_status: 'draft' | 'active' | 'pending' | 'sold' | 'expired' | 'cancelled'
      property_type: 'single_family' | 'condo' | 'townhouse' | 'multi_family' | 'land' | 'mobile' | 'other'
      offer_status: 'pending' | 'viewed' | 'accepted' | 'rejected' | 'countered' | 'expired' | 'withdrawn'
      financing_type: 'conventional' | 'fha' | 'va' | 'usda' | 'cash' | 'other'
      document_type: 'disclosure' | 'purchase_agreement' | 'addendum' | 'inspection' | 'pre_approval' | 'earnest_money' | 'closing' | 'other'
      showing_status: 'requested' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'
      transaction_status: 'under_contract' | 'inspection' | 'appraisal' | 'financing' | 'final_walkthrough' | 'closing' | 'closed' | 'cancelled'
    }
  }
}
