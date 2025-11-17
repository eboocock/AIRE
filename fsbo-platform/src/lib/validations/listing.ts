import { z } from 'zod'

export const listingSchema = z.object({
  // Step 1: Property Address
  address_line1: z.string().min(1, 'Street address is required'),
  address_line2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().default('WA'),
  zip_code: z.string().regex(/^\d{5}$/, 'ZIP code must be 5 digits'),
  county: z.string().optional(),

  // Step 2: Property Details
  property_type: z.enum(['single_family', 'condo', 'townhouse', 'multi_family', 'land', 'mobile', 'other']),
  bedrooms: z.number().min(0, 'Bedrooms must be 0 or more').max(20, 'Maximum 20 bedrooms'),
  bathrooms: z.number().min(0, 'Bathrooms must be 0 or more').max(20, 'Maximum 20 bathrooms'),
  sqft: z.number().min(1, 'Square footage is required').optional(),
  lot_size: z.number().min(0).optional(),
  year_built: z.number().min(1800).max(new Date().getFullYear() + 1).optional(),
  parking_spaces: z.number().min(0).optional(),
  garage_spaces: z.number().min(0).optional(),

  // Step 3: Pricing
  price: z.number().min(1000, 'Price must be at least $1,000'),
  hoa_fee: z.number().min(0).optional(),
  property_tax: z.number().min(0).optional(),

  // Step 4: Description & Features
  title: z.string().optional(),
  description: z.string().min(50, 'Description must be at least 50 characters').optional(),
  has_ac: z.boolean().default(false),
  has_heating: z.boolean().default(true),
  heating_type: z.string().optional(),
  has_fireplace: z.boolean().default(false),
  has_pool: z.boolean().default(false),
  has_basement: z.boolean().default(false),
  features: z.array(z.string()).default([]),

  // Step 5: Photos
  photos: z.array(z.object({
    url: z.string(),
    order: z.number(),
    caption: z.string().optional(),
  })).default([]),
  video_url: z.string().url().optional().or(z.literal('')),
  virtual_tour_url: z.string().url().optional().or(z.literal('')),

  // Meta
  status: z.enum(['draft', 'active']).default('draft'),
})

export type ListingFormData = z.infer<typeof listingSchema>

// Partial schemas for each step
export const step1Schema = listingSchema.pick({
  address_line1: true,
  address_line2: true,
  city: true,
  state: true,
  zip_code: true,
  county: true,
})

export const step2Schema = listingSchema.pick({
  property_type: true,
  bedrooms: true,
  bathrooms: true,
  sqft: true,
  lot_size: true,
  year_built: true,
  parking_spaces: true,
  garage_spaces: true,
})

export const step3Schema = listingSchema.pick({
  price: true,
  hoa_fee: true,
  property_tax: true,
})

export const step4Schema = listingSchema.pick({
  title: true,
  description: true,
  has_ac: true,
  has_heating: true,
  heating_type: true,
  has_fireplace: true,
  has_pool: true,
  has_basement: true,
  features: true,
})

export const step5Schema = listingSchema.pick({
  photos: true,
  video_url: true,
  virtual_tour_url: true,
})
