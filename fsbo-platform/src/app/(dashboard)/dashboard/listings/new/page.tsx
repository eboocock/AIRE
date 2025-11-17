'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { listingSchema, type ListingFormData } from '@/lib/validations/listing'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, ArrowRight, Save, CheckCircle } from 'lucide-react'

// Step components
import Step1Address from '@/components/listing/Step1Address'
import Step2Details from '@/components/listing/Step2Details'
import Step3Pricing from '@/components/listing/Step3Pricing'
import Step4Description from '@/components/listing/Step4Description'
import Step5Photos from '@/components/listing/Step5Photos'
import Step6Review from '@/components/listing/Step6Review'

const STEPS = [
  { number: 1, title: 'Property Address', component: Step1Address },
  { number: 2, title: 'Property Details', component: Step2Details },
  { number: 3, title: 'Pricing', component: Step3Pricing },
  { number: 4, title: 'Description & Features', component: Step4Description },
  { number: 5, title: 'Photos & Media', component: Step5Photos },
  { number: 6, title: 'Review & Publish', component: Step6Review },
]

export default function NewListingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [listingId, setListingId] = useState<string | null>(null)

  const methods = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      state: 'WA',
      status: 'draft',
      has_heating: true,
      has_ac: false,
      has_fireplace: false,
      has_pool: false,
      has_basement: false,
      features: [],
      photos: [],
    },
    mode: 'onChange',
  })

  const { handleSubmit, trigger, watch } = methods
  const formData = watch()

  const CurrentStepComponent = STEPS[currentStep - 1].component

  const handleNext = async () => {
    // Validate current step before proceeding
    const fieldsToValidate = getFieldsForStep(currentStep)
    const isValid = await trigger(fieldsToValidate)

    if (isValid) {
      if (currentStep < STEPS.length) {
        setCurrentStep(currentStep + 1)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSaveDraft = async () => {
    setSaving(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('Not authenticated')
      }

      const dataToSave: any = {
        ...formData,
        user_id: user.id,
        status: 'draft' as const,
      }

      let result: any
      if (listingId) {
        // Update existing draft
        result = await (supabase.from('listings') as any).update(dataToSave).eq('id', listingId).select().single()
      } else {
        // Create new draft
        result = await (supabase.from('listings') as any).insert(dataToSave).select().single()
        if (result.data) {
          setListingId(result.data.id)
        }
      }

      if (result.error) throw result.error

      alert('Draft saved successfully!')
    } catch (error: any) {
      console.error('Error saving draft:', error)
      alert('Failed to save draft: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async (data: ListingFormData) => {
    setSaving(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error('Not authenticated')
      }

      // Generate slug from address and city
      const slug = `${data.city.toLowerCase()}-${data.address_line1
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')}-${Date.now()}`

      const dataToSave: any = {
        ...data,
        user_id: user.id,
        status: 'active' as const,
        slug,
        published_at: new Date().toISOString(),
        meta_title: `${data.address_line1}, ${data.city}, WA ${data.zip_code} - For Sale By Owner`,
        meta_description: data.description?.substring(0, 155) || `${data.bedrooms} bed, ${data.bathrooms} bath home for sale in ${data.city}, WA`,
      }

      let result: any
      if (listingId) {
        // Update and publish existing draft
        result = await (supabase.from('listings') as any).update(dataToSave).eq('id', listingId).select().single()
      } else {
        // Create and publish new listing
        result = await (supabase.from('listings') as any).insert(dataToSave).select().single()
      }

      if (result.error) throw result.error

      // Redirect to listings page
      router.push('/dashboard/listings')
    } catch (error: any) {
      console.error('Error publishing listing:', error)
      alert('Failed to publish listing: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="lg:pl-64">
      <div className="container max-w-4xl py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard/listings')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Listings
          </button>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Create New Listing</h1>
          <p className="text-slate-600">Follow the steps below to create your property listing</p>
        </div>

        {/* Progress Indicator */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-6">
            {STEPS.map((step, index) => (
              <div key={step.number} className="flex-1">
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                      currentStep > step.number
                        ? 'bg-green-500 text-white'
                        : currentStep === step.number
                        ? 'bg-primary-500 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {currentStep > step.number ? <CheckCircle className="w-5 h-5" /> : step.number}
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 transition-colors ${
                        currentStep > step.number ? 'bg-green-500' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>
                <p
                  className={`text-xs mt-2 ${
                    currentStep === step.number ? 'text-primary-600 font-semibold' : 'text-slate-600'
                  }`}
                >
                  {step.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handlePublish)}>
            <div className="card mb-6">
              <CurrentStepComponent />
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
              <div>
                {currentStep > 1 && (
                  <button type="button" onClick={handleBack} className="btn-outline flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Draft'}
                </button>

                {currentStep < STEPS.length ? (
                  <button type="button" onClick={handleNext} className="btn-primary flex items-center gap-2">
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    {saving ? 'Publishing...' : 'Publish Listing'}
                  </button>
                )}
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}

// Helper function to get fields to validate for each step
function getFieldsForStep(step: number): (keyof ListingFormData)[] {
  switch (step) {
    case 1:
      return ['address_line1', 'city', 'state', 'zip_code']
    case 2:
      return ['property_type', 'bedrooms', 'bathrooms']
    case 3:
      return ['price']
    case 4:
      return []
    case 5:
      return []
    case 6:
      return []
    default:
      return []
  }
}
