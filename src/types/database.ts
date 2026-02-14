// Database types for AIRE
// Auto-generate with: npm run db:generate

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ListingStatus =
  | 'draft'
  | 'pending_review'
  | 'active'
  | 'under_contract'
  | 'sold'
  | 'withdrawn'
  | 'expired';

export type OfferStatus =
  | 'pending'
  | 'countered'
  | 'accepted'
  | 'rejected'
  | 'withdrawn'
  | 'expired';

export type ShowingStatus =
  | 'requested'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export type DocumentType =
  | 'listing_agreement'
  | 'seller_disclosure'
  | 'lead_paint_disclosure'
  | 'purchase_agreement'
  | 'counter_offer'
  | 'addendum'
  | 'inspection_report'
  | 'appraisal'
  | 'title_report'
  | 'closing_disclosure'
  | 'other';

export type DocumentStatus =
  | 'draft'
  | 'pending_signature'
  | 'signed'
  | 'expired'
  | 'voided';

export type UserRole = 'seller' | 'buyer' | 'admin';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          role: UserRole;
          stripe_customer_id: string | null;
          email_verified: boolean;
          phone_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          stripe_customer_id?: string | null;
          email_verified?: boolean;
          phone_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          stripe_customer_id?: string | null;
          email_verified?: boolean;
          phone_verified?: boolean;
          updated_at?: string;
        };
      };
      listings: {
        Row: {
          id: string;
          seller_id: string;
          street_address: string;
          unit: string | null;
          city: string;
          state: string;
          zip_code: string;
          county: string | null;
          latitude: number | null;
          longitude: number | null;
          property_type: string;
          beds: number | null;
          baths: number | null;
          sqft: number | null;
          lot_size: number | null;
          year_built: number | null;
          stories: number | null;
          garage_spaces: number | null;
          list_price: number | null;
          ai_estimated_value: number | null;
          ai_value_low: number | null;
          ai_value_high: number | null;
          ai_confidence_score: number | null;
          price_per_sqft: number | null;
          headline: string | null;
          description: string | null;
          ai_generated_description: string | null;
          features: Json;
          status: ListingStatus;
          listed_at: string | null;
          under_contract_at: string | null;
          sold_at: string | null;
          sold_price: number | null;
          days_on_market: number | null;
          mls_number: string | null;
          mls_listed: boolean;
          view_count: number;
          save_count: number;
          inquiry_count: number;
          showing_count: number;
          imported_from: string | null;
          imported_data: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          seller_id: string;
          street_address: string;
          unit?: string | null;
          city: string;
          state: string;
          zip_code: string;
          county?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          property_type?: string;
          beds?: number | null;
          baths?: number | null;
          sqft?: number | null;
          lot_size?: number | null;
          year_built?: number | null;
          stories?: number | null;
          garage_spaces?: number | null;
          list_price?: number | null;
          ai_estimated_value?: number | null;
          ai_value_low?: number | null;
          ai_value_high?: number | null;
          ai_confidence_score?: number | null;
          headline?: string | null;
          description?: string | null;
          ai_generated_description?: string | null;
          features?: Json;
          status?: ListingStatus;
          mls_number?: string | null;
          imported_from?: string | null;
          imported_data?: Json | null;
        };
        Update: Partial<Database['public']['Tables']['listings']['Insert']>;
      };
      listing_photos: {
        Row: {
          id: string;
          listing_id: string;
          storage_path: string;
          url: string;
          caption: string | null;
          room_type: string | null;
          is_primary: boolean;
          sort_order: number;
          width: number | null;
          height: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          listing_id: string;
          storage_path: string;
          url: string;
          caption?: string | null;
          room_type?: string | null;
          is_primary?: boolean;
          sort_order?: number;
          width?: number | null;
          height?: number | null;
        };
        Update: Partial<Database['public']['Tables']['listing_photos']['Insert']>;
      };
      offers: {
        Row: {
          id: string;
          listing_id: string;
          buyer_id: string | null;
          buyer_name: string | null;
          buyer_email: string | null;
          buyer_phone: string | null;
          buyer_agent_name: string | null;
          buyer_agent_email: string | null;
          buyer_agent_phone: string | null;
          offer_price: number;
          earnest_money: number | null;
          down_payment_percent: number | null;
          financing_type: string | null;
          pre_approval_amount: number | null;
          inspection_contingency: boolean;
          inspection_days: number;
          financing_contingency: boolean;
          financing_days: number;
          appraisal_contingency: boolean;
          sale_contingency: boolean;
          sale_contingency_address: string | null;
          closing_date: string | null;
          possession_date: string | null;
          additional_terms: string | null;
          status: OfferStatus;
          counter_offer_id: string | null;
          ai_strength_score: number | null;
          ai_analysis: Json | null;
          submitted_at: string;
          expires_at: string | null;
          responded_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          listing_id: string;
          buyer_id?: string | null;
          offer_price: number;
          earnest_money?: number | null;
          financing_type?: string | null;
          inspection_contingency?: boolean;
          financing_contingency?: boolean;
          appraisal_contingency?: boolean;
          closing_date?: string | null;
          additional_terms?: string | null;
        };
        Update: Partial<Database['public']['Tables']['offers']['Insert']>;
      };
      showings: {
        Row: {
          id: string;
          listing_id: string;
          buyer_id: string | null;
          buyer_name: string;
          buyer_email: string | null;
          buyer_phone: string | null;
          buyer_agent_name: string | null;
          requested_date: string;
          requested_time_start: string;
          requested_time_end: string | null;
          confirmed_date: string | null;
          confirmed_time_start: string | null;
          confirmed_time_end: string | null;
          status: ShowingStatus;
          buyer_feedback: string | null;
          buyer_rating: number | null;
          interested: boolean | null;
          lockbox_code: string | null;
          access_instructions: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          listing_id: string;
          buyer_id?: string | null;
          buyer_name: string;
          buyer_email?: string | null;
          buyer_phone?: string | null;
          requested_date: string;
          requested_time_start: string;
          requested_time_end?: string | null;
        };
        Update: Partial<Database['public']['Tables']['showings']['Insert']>;
      };
      documents: {
        Row: {
          id: string;
          listing_id: string;
          offer_id: string | null;
          name: string;
          document_type: DocumentType;
          description: string | null;
          storage_path: string;
          url: string;
          file_size: number | null;
          mime_type: string | null;
          status: DocumentStatus;
          requires_signature: boolean;
          signature_provider: string | null;
          signature_envelope_id: string | null;
          signed_at: string | null;
          signed_by: Json;
          ai_generated: boolean;
          ai_template_used: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          listing_id: string;
          offer_id?: string | null;
          name: string;
          document_type: DocumentType;
          storage_path: string;
          url: string;
          file_size?: number | null;
          mime_type?: string | null;
          requires_signature?: boolean;
          ai_generated?: boolean;
          ai_template_used?: string | null;
        };
        Update: Partial<Database['public']['Tables']['documents']['Insert']>;
      };
      messages: {
        Row: {
          id: string;
          listing_id: string;
          sender_id: string | null;
          recipient_id: string | null;
          sender_name: string | null;
          sender_email: string | null;
          sender_phone: string | null;
          subject: string | null;
          body: string;
          read_at: string | null;
          replied_at: string | null;
          ai_suggested_reply: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          listing_id: string;
          sender_id?: string | null;
          recipient_id?: string | null;
          sender_name?: string | null;
          sender_email?: string | null;
          body: string;
          subject?: string | null;
        };
        Update: Partial<Database['public']['Tables']['messages']['Insert']>;
      };
      saved_listings: {
        Row: {
          id: string;
          user_id: string;
          listing_id: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          listing_id: string;
          notes?: string | null;
        };
        Update: {
          notes?: string | null;
        };
      };
      transactions: {
        Row: {
          id: string;
          listing_id: string;
          user_id: string;
          stripe_payment_intent_id: string | null;
          stripe_charge_id: string | null;
          amount: number;
          currency: string;
          status: string;
          transaction_type: string;
          description: string | null;
          metadata: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          listing_id: string;
          user_id: string;
          amount: number;
          status: string;
          transaction_type: string;
          stripe_payment_intent_id?: string | null;
          description?: string | null;
          metadata?: Json | null;
        };
        Update: Partial<Database['public']['Tables']['transactions']['Insert']>;
      };
      ai_valuations: {
        Row: {
          id: string;
          street_address: string;
          city: string;
          state: string;
          zip_code: string;
          estimated_value: number | null;
          value_low: number | null;
          value_high: number | null;
          confidence_score: number | null;
          price_per_sqft: number | null;
          property_data: Json | null;
          comparables: Json | null;
          market_data: Json | null;
          listing_description: string | null;
          improvements: Json | null;
          data_sources: Json | null;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          street_address: string;
          city: string;
          state: string;
          zip_code: string;
          estimated_value?: number | null;
          value_low?: number | null;
          value_high?: number | null;
          confidence_score?: number | null;
          property_data?: Json | null;
          comparables?: Json | null;
          market_data?: Json | null;
          listing_description?: string | null;
          improvements?: Json | null;
          data_sources?: Json | null;
        };
        Update: Partial<Database['public']['Tables']['ai_valuations']['Insert']>;
      };
    };
  };
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

// Commonly used types
export type Profile = Tables<'profiles'>;
export type Listing = Tables<'listings'>;
export type ListingPhoto = Tables<'listing_photos'>;
export type Offer = Tables<'offers'>;
export type Showing = Tables<'showings'>;
export type Document = Tables<'documents'>;
export type Message = Tables<'messages'>;
export type Transaction = Tables<'transactions'>;
export type AIValuation = Tables<'ai_valuations'>;

// Extended types with relations
export interface ListingWithPhotos extends Listing {
  photos: ListingPhoto[];
}

export interface ListingWithDetails extends Listing {
  photos: ListingPhoto[];
  seller: Profile;
  offers: Offer[];
  showings: Showing[];
  documents: Document[];
}

export interface OfferWithDetails extends Offer {
  listing: Listing;
  buyer: Profile | null;
}
