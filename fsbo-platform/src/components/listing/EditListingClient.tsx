'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { listingSchema, type ListingFormData } from '@/lib/validations/listing'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, ArrowRight, Save, CheckCircle } from 'lucide-react'

// Step components (reuse from create wizard)
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
  { number: 6, title: 'Review & Update', component: Step6Review },
]

export default function EditListingClient({ listing }: { listing: any }) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [saving, setSaving] = useState(false)

  const methods = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      ...listing,
      // Ensure arrays and booleans are properly set
      features: listing.features || [],
      photos: listing.photos || [],
      has_ac: listing.has_ac || false,
      has_heating: listing.has_heating || true,
      has_fireplace: listing.has_fireplace || false,
      has_pool: listing.has_pool || false,
      has_basement: listing.has_basement || false,
    },
    mode: 'onChange',
  })

  const { handleSubmit, trigger, watch } = methods
  const formData = watch()

  const CurrentStepComponent = STEPS[currentStep - 1].component

  const handleNext = async () => {
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

  const handleSave = async (data: ListingFormData, shouldPublish: boolean = false) => {
    setSaving(true)
    try {
      const supabase = createClient()

      const dataToSave: any = {
        ...data,
        status: shouldPublish ? 'active' : listing.status,
        published_at: shouldPublish && !listing.published_at ? new Date().toISOString() : listing.published_at,
      }

      const { error } = await (supabase
        .from('listings') as any)
        .update(dataToSave)
        .eq('id', listing.id)

      if (error) throw error

      router.push('/dashboard/listings')
      router.refresh()
    } catch (error: any) {
      console.error('Error updating listing:', error)
      alert('Failed to update listing: ' + error.message)
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
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Edit Listing</h1>
          <p className="text-slate-600">Update your property listing details</p>
        </div>

        {/* Progress Indicator */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-6">
            {STEPS.map((step, index) => (
              <div key={step.number} className="flex-1">
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(step.number)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                      currentStep > step.number
                        ? 'bg-green-500 text-white'
                        : currentStep === step.number
                        ? 'bg-primary-500 text-white'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    {currentStep > step.number ? <CheckCircle className="w-5 h-5" /> : step.number}
                  </button>
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
          <form onSubmit={handleSubmit((data) => handleSave(data, listing.status !== 'active'))}>
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
                  onClick={() => handleSave(formData, false)}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>

                {currentStep < STEPS.length ? (
                  <button type="button" onClick={handleNext} className="btn-primary flex items-center gap-2">
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    {saving ? 'Saving...' : listing.status === 'active' ? 'Update Listing' : 'Update & Publish'}
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
