'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSupabaseClient } from '@/lib/supabase/client';

type Step = 'address' | 'details' | 'description' | 'photos' | 'pricing' | 'review';

const STEPS: { key: Step; label: string; icon: string }[] = [
  { key: 'address', label: 'Address', icon: 'fa-map-marker-alt' },
  { key: 'details', label: 'Details', icon: 'fa-home' },
  { key: 'description', label: 'Description', icon: 'fa-pen' },
  { key: 'photos', label: 'Photos', icon: 'fa-camera' },
  { key: 'pricing', label: 'Pricing', icon: 'fa-dollar-sign' },
  { key: 'review', label: 'Review', icon: 'fa-check' },
];

const PROPERTY_TYPES = [
  'Single Family',
  'Condo',
  'Townhouse',
  'Multi-Family',
  'Land',
  'Other',
];

const FEATURES_LIST = [
  'Central AC', 'Fireplace', 'Hardwood Floors', 'Pool', 'Hot Tub',
  'Solar Panels', 'Smart Home', 'EV Charger', 'Deck/Patio', 'Fenced Yard',
  'Garage', 'Basement', 'Attic', 'Walk-in Closet', 'Updated Kitchen',
  'Granite Countertops', 'Stainless Appliances', 'In-unit Laundry',
  'Water View', 'Mountain View', 'City View',
];

interface ListingFormData {
  street_address: string;
  unit: string;
  city: string;
  state: string;
  zip_code: string;
  property_type: string;
  beds: string;
  baths: string;
  sqft: string;
  lot_size: string;
  year_built: string;
  stories: string;
  garage_spaces: string;
  headline: string;
  description: string;
  ai_generated_description: string;
  features: string[];
  list_price: string;
  ai_estimated_value: number | null;
  ai_value_low: number | null;
  ai_value_high: number | null;
  ai_confidence_score: number | null;
}

export default function NewListingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('address');
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [generatingDesc, setGeneratingDesc] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<ListingFormData>({
    street_address: '',
    unit: '',
    city: '',
    state: '',
    zip_code: '',
    property_type: 'Single Family',
    beds: '',
    baths: '',
    sqft: '',
    lot_size: '',
    year_built: '',
    stories: '',
    garage_spaces: '',
    headline: '',
    description: '',
    ai_generated_description: '',
    features: [],
    list_price: '',
    ai_estimated_value: null,
    ai_value_low: null,
    ai_value_high: null,
    ai_confidence_score: null,
  });

  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([]);

  const updateForm = (updates: Partial<ListingFormData>) => {
    setForm(prev => ({ ...prev, ...updates }));
  };

  const toggleFeature = (feature: string) => {
    setForm(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const currentStepIndex = STEPS.findIndex(s => s.key === currentStep);

  const goNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex].key);
    }
  };

  const goPrev = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex].key);
    }
  };

  const runAIAnalysis = async () => {
    setAnalyzing(true);
    setError(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: `${form.street_address}, ${form.city}, ${form.state} ${form.zip_code}`,
          propertyDetails: {
            beds: form.beds ? parseInt(form.beds) : undefined,
            baths: form.baths ? parseFloat(form.baths) : undefined,
            sqft: form.sqft ? parseInt(form.sqft) : undefined,
            yearBuilt: form.year_built ? parseInt(form.year_built) : undefined,
            propertyType: form.property_type,
          },
        }),
      });

      if (!res.ok) throw new Error('Analysis failed');

      const data = await res.json();

      updateForm({
        ai_estimated_value: data.estimated_value || null,
        ai_value_low: data.value_low || null,
        ai_value_high: data.value_high || null,
        ai_confidence_score: data.confidence_score || null,
        ai_generated_description: data.listing_description || '',
      });

      if (!form.list_price && data.estimated_value) {
        updateForm({ list_price: data.estimated_value.toString() });
      }
    } catch (err: any) {
      setError('AI analysis failed. You can still set pricing manually.');
    } finally {
      setAnalyzing(false);
    }
  };

  const generateDescription = async () => {
    setGeneratingDesc(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: `${form.street_address}, ${form.city}, ${form.state} ${form.zip_code}`,
          propertyDetails: {
            beds: form.beds ? parseInt(form.beds) : undefined,
            baths: form.baths ? parseFloat(form.baths) : undefined,
            sqft: form.sqft ? parseInt(form.sqft) : undefined,
            yearBuilt: form.year_built ? parseInt(form.year_built) : undefined,
            propertyType: form.property_type,
            features: form.features,
          },
        }),
      });

      if (!res.ok) throw new Error('Description generation failed');
      const data = await res.json();

      if (data.listing_description) {
        updateForm({ ai_generated_description: data.listing_description });
      }
    } catch {
      setError('Could not generate description. Please write one manually.');
    } finally {
      setGeneratingDesc(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setPhotos(prev => [...prev, ...files]);
    const newUrls = files.map(f => URL.createObjectURL(f));
    setPhotoPreviewUrls(prev => [...prev, ...newUrls]);
  };

  const removePhoto = (index: number) => {
    URL.revokeObjectURL(photoPreviewUrls[index]);
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotoPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handlePublish = async (asDraft = false) => {
    setSaving(true);
    setError(null);

    try {
      const supabase = getSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login?redirectTo=/listings/new');
        return;
      }

      // Upload photos to Supabase Storage
      const uploadedPhotos: { url: string; storage_path: string; is_primary: boolean }[] = [];
      for (let i = 0; i < photos.length; i++) {
        const file = photos[i];
        const ext = file.name.split('.').pop();
        const path = `listings/${user.id}/${Date.now()}_${i}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from('listing-photos')
          .upload(path, file);

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('listing-photos')
            .getPublicUrl(path);

          uploadedPhotos.push({
            url: publicUrl,
            storage_path: path,
            is_primary: i === 0,
          });
        }
      }

      // Create the listing
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          street_address: form.street_address,
          unit: form.unit || null,
          city: form.city,
          state: form.state,
          zip_code: form.zip_code,
          property_type: form.property_type,
          beds: form.beds ? parseInt(form.beds) : null,
          baths: form.baths ? parseFloat(form.baths) : null,
          sqft: form.sqft ? parseInt(form.sqft) : null,
          lot_size: form.lot_size ? parseFloat(form.lot_size) : null,
          year_built: form.year_built ? parseInt(form.year_built) : null,
          stories: form.stories ? parseInt(form.stories) : null,
          garage_spaces: form.garage_spaces ? parseInt(form.garage_spaces) : null,
          headline: form.headline || null,
          description: form.description || form.ai_generated_description || null,
          ai_generated_description: form.ai_generated_description || null,
          features: form.features,
          list_price: form.list_price ? parseInt(form.list_price) : null,
          ai_estimated_value: form.ai_estimated_value,
          ai_value_low: form.ai_value_low,
          ai_value_high: form.ai_value_high,
          ai_confidence_score: form.ai_confidence_score,
          status: asDraft ? 'draft' : 'active',
          photos: uploadedPhotos,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to create listing');
      }

      const listing = await res.json();
      router.push(`/dashboard`);
    } catch (err: any) {
      setError(err.message || 'Failed to create listing');
      setSaving(false);
    }
  };

  const formatPrice = (value: string) => {
    const num = parseInt(value.replace(/\D/g, ''));
    if (isNaN(num)) return '';
    return num.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Top Bar */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white transition">
              <i className="fas fa-arrow-left mr-2" />
              Back
            </Link>
            <h1 className="text-lg font-semibold text-white">Create New Listing</h1>
          </div>
          <button
            onClick={() => handlePublish(true)}
            disabled={saving}
            className="text-sm text-gray-400 hover:text-white transition"
          >
            Save as Draft
          </button>
        </div>
      </div>

      {/* Step Progress */}
      <div className="bg-gray-900/50 border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {STEPS.map((step, i) => (
              <button
                key={step.key}
                onClick={() => setCurrentStep(step.key)}
                className={`flex items-center space-x-2 text-sm transition ${
                  i === currentStepIndex
                    ? 'text-aire-400 font-semibold'
                    : i < currentStepIndex
                    ? 'text-aire-600'
                    : 'text-gray-600'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                    i === currentStepIndex
                      ? 'bg-aire-500 text-white'
                      : i < currentStepIndex
                      ? 'bg-aire-500/20 text-aire-400'
                      : 'bg-gray-800 text-gray-500'
                  }`}
                >
                  {i < currentStepIndex ? (
                    <i className="fas fa-check" />
                  ) : (
                    <i className={`fas ${step.icon}`} />
                  )}
                </div>
                <span className="hidden sm:inline">{step.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="max-w-5xl mx-auto px-4 mt-4">
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-center justify-between">
            <span><i className="fas fa-exclamation-circle mr-2" />{error}</span>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300">
              <i className="fas fa-times" />
            </button>
          </div>
        </div>
      )}

      {/* Form Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Step: Address */}
        {currentStep === 'address' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Property Address</h2>
              <p className="text-gray-400">Enter the property address to get started.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Street Address</label>
                <input
                  type="text"
                  value={form.street_address}
                  onChange={e => updateForm({ street_address: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-aire-500"
                  placeholder="123 Main Street"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Unit/Apt (optional)</label>
                <input
                  type="text"
                  value={form.unit}
                  onChange={e => updateForm({ unit: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-aire-500"
                  placeholder="Unit 2B"
                />
              </div>

              <div className="grid grid-cols-6 gap-4">
                <div className="col-span-3">
                  <label className="block text-sm font-medium text-gray-300 mb-1">City</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={e => updateForm({ city: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-aire-500"
                    placeholder="Seattle"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-300 mb-1">State</label>
                  <input
                    type="text"
                    value={form.state}
                    onChange={e => updateForm({ state: e.target.value.toUpperCase().slice(0, 2) })}
                    maxLength={2}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-aire-500"
                    placeholder="WA"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">ZIP Code</label>
                  <input
                    type="text"
                    value={form.zip_code}
                    onChange={e => updateForm({ zip_code: e.target.value.slice(0, 10) })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-aire-500"
                    placeholder="98101"
                  />
                </div>
              </div>
            </div>

            {/* AI Analysis CTA */}
            <div className="bg-gradient-to-r from-aire-500/10 to-blue-500/10 border border-aire-500/20 rounded-xl p-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-aire-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-robot text-aire-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-1">AI Property Analysis</h3>
                  <p className="text-gray-400 text-sm mb-3">
                    Get an instant AI valuation, market analysis, and auto-generated listing description.
                  </p>
                  <button
                    onClick={runAIAnalysis}
                    disabled={analyzing || !form.street_address || !form.city || !form.state || !form.zip_code}
                    className="px-4 py-2 bg-aire-500 hover:bg-aire-600 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm font-medium rounded-lg transition"
                  >
                    {analyzing ? (
                      <><i className="fas fa-spinner fa-spin mr-2" />Analyzing...</>
                    ) : (
                      <><i className="fas fa-magic mr-2" />Run AI Analysis</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step: Details */}
        {currentStep === 'details' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Property Details</h2>
              <p className="text-gray-400">Tell buyers about your property.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Property Type</label>
              <div className="grid grid-cols-3 gap-3">
                {PROPERTY_TYPES.map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => updateForm({ property_type: type })}
                    className={`p-3 rounded-lg border text-sm font-medium transition ${
                      form.property_type === type
                        ? 'bg-aire-500/10 border-aire-500 text-aire-400'
                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Bedrooms</label>
                <input
                  type="number"
                  value={form.beds}
                  onChange={e => updateForm({ beds: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-aire-500"
                  placeholder="3"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Bathrooms</label>
                <input
                  type="number"
                  value={form.baths}
                  onChange={e => updateForm({ baths: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-aire-500"
                  placeholder="2"
                  min="0"
                  step="0.5"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Square Feet</label>
                <input
                  type="number"
                  value={form.sqft}
                  onChange={e => updateForm({ sqft: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-aire-500"
                  placeholder="2000"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Lot Size (acres)</label>
                <input
                  type="number"
                  value={form.lot_size}
                  onChange={e => updateForm({ lot_size: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-aire-500"
                  placeholder="0.25"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Year Built</label>
                <input
                  type="number"
                  value={form.year_built}
                  onChange={e => updateForm({ year_built: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-aire-500"
                  placeholder="2005"
                  min="1800"
                  max="2030"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Stories</label>
                <input
                  type="number"
                  value={form.stories}
                  onChange={e => updateForm({ stories: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-aire-500"
                  placeholder="2"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Garage Spaces</label>
                <input
                  type="number"
                  value={form.garage_spaces}
                  onChange={e => updateForm({ garage_spaces: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-aire-500"
                  placeholder="2"
                  min="0"
                />
              </div>
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Features</label>
              <div className="flex flex-wrap gap-2">
                {FEATURES_LIST.map(feature => (
                  <button
                    key={feature}
                    type="button"
                    onClick={() => toggleFeature(feature)}
                    className={`px-3 py-1.5 rounded-full text-sm transition ${
                      form.features.includes(feature)
                        ? 'bg-aire-500/20 text-aire-400 border border-aire-500/30'
                        : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    {form.features.includes(feature) && <i className="fas fa-check mr-1 text-xs" />}
                    {feature}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step: Description */}
        {currentStep === 'description' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Listing Description</h2>
              <p className="text-gray-400">Write a compelling description or let AI generate one for you.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Headline</label>
              <input
                type="text"
                value={form.headline}
                onChange={e => updateForm({ headline: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-aire-500"
                placeholder="Stunning Modern Home with Mountain Views"
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1">{form.headline.length}/100 characters</p>
            </div>

            {/* AI Description */}
            {form.ai_generated_description && (
              <div className="bg-aire-500/5 border border-aire-500/20 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-aire-400">
                    <i className="fas fa-robot mr-1" /> AI-Generated Description
                  </span>
                  <button
                    onClick={() => updateForm({
                      description: form.ai_generated_description,
                    })}
                    className="text-xs text-aire-400 hover:text-aire-300"
                  >
                    Use this description
                  </button>
                </div>
                <p className="text-gray-300 text-sm whitespace-pre-wrap">{form.ai_generated_description}</p>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-300">Description</label>
                <button
                  onClick={generateDescription}
                  disabled={generatingDesc}
                  className="text-sm text-aire-400 hover:text-aire-300 transition"
                >
                  {generatingDesc ? (
                    <><i className="fas fa-spinner fa-spin mr-1" />Generating...</>
                  ) : (
                    <><i className="fas fa-magic mr-1" />Generate with AI</>
                  )}
                </button>
              </div>
              <textarea
                value={form.description}
                onChange={e => updateForm({ description: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-aire-500 h-48 resize-y"
                placeholder="Describe your property in detail..."
              />
            </div>
          </div>
        )}

        {/* Step: Photos */}
        {currentStep === 'photos' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Property Photos</h2>
              <p className="text-gray-400">Upload photos of your property. The first photo will be the primary listing image.</p>
            </div>

            {/* Upload Area */}
            <label className="block border-2 border-dashed border-gray-700 rounded-xl p-8 text-center cursor-pointer hover:border-aire-500/50 transition">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <i className="fas fa-cloud-upload-alt text-3xl text-gray-500 mb-3" />
              <p className="text-gray-400">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-600 mt-1">JPG, PNG, WebP up to 10MB each</p>
            </label>

            {/* Photo Grid */}
            {photoPreviewUrls.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {photoPreviewUrls.map((url, i) => (
                  <div key={i} className="relative group aspect-[4/3] rounded-lg overflow-hidden bg-gray-800">
                    <img
                      src={url}
                      alt={`Photo ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {i === 0 && (
                      <div className="absolute top-2 left-2 px-2 py-1 bg-aire-500 rounded text-xs text-white font-medium">
                        Primary
                      </div>
                    )}
                    <button
                      onClick={() => removePhoto(i)}
                      className="absolute top-2 right-2 w-7 h-7 bg-red-500/80 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition"
                    >
                      <i className="fas fa-times text-xs" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {photoPreviewUrls.length === 0 && (
              <p className="text-sm text-gray-500 text-center">
                No photos uploaded yet. Photos help attract more buyers.
              </p>
            )}
          </div>
        )}

        {/* Step: Pricing */}
        {currentStep === 'pricing' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Set Your Price</h2>
              <p className="text-gray-400">Use AI insights to price your property competitively.</p>
            </div>

            {/* AI Valuation Summary */}
            {form.ai_estimated_value && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-sm font-medium text-gray-400 mb-4">
                  <i className="fas fa-robot mr-1 text-aire-400" /> AI Valuation
                </h3>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-white">
                    ${form.ai_estimated_value.toLocaleString()}
                  </div>
                  {form.ai_value_low && form.ai_value_high && (
                    <div className="text-sm text-gray-400 mt-1">
                      Range: ${form.ai_value_low.toLocaleString()} - ${form.ai_value_high.toLocaleString()}
                    </div>
                  )}
                  {form.ai_confidence_score && (
                    <div className="mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        form.ai_confidence_score >= 80
                          ? 'bg-green-500/20 text-green-400'
                          : form.ai_confidence_score >= 60
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {form.ai_confidence_score}% confidence
                      </span>
                    </div>
                  )}
                </div>

                {/* Price positioning */}
                {form.list_price && form.ai_estimated_value && (
                  <div className="text-center text-sm">
                    {parseInt(form.list_price) > form.ai_estimated_value * 1.05 ? (
                      <span className="text-yellow-400">
                        <i className="fas fa-arrow-up mr-1" />
                        Priced {Math.round(((parseInt(form.list_price) / form.ai_estimated_value) - 1) * 100)}% above AI estimate
                      </span>
                    ) : parseInt(form.list_price) < form.ai_estimated_value * 0.95 ? (
                      <span className="text-blue-400">
                        <i className="fas fa-arrow-down mr-1" />
                        Priced {Math.round((1 - (parseInt(form.list_price) / form.ai_estimated_value)) * 100)}% below AI estimate
                      </span>
                    ) : (
                      <span className="text-green-400">
                        <i className="fas fa-check mr-1" />
                        Competitively priced
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {!form.ai_estimated_value && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
                <p className="text-gray-400 text-sm mb-3">No AI valuation yet.</p>
                <button
                  onClick={runAIAnalysis}
                  disabled={analyzing || !form.street_address}
                  className="px-4 py-2 bg-aire-500 hover:bg-aire-600 disabled:bg-gray-700 text-white text-sm font-medium rounded-lg transition"
                >
                  {analyzing ? 'Analyzing...' : 'Get AI Valuation'}
                </button>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">List Price ($)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">$</span>
                <input
                  type="text"
                  value={form.list_price ? formatPrice(form.list_price) : ''}
                  onChange={e => {
                    const raw = e.target.value.replace(/\D/g, '');
                    updateForm({ list_price: raw });
                  }}
                  className="w-full pl-8 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-lg text-white text-2xl font-semibold placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-aire-500"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Savings Calculator */}
            {form.list_price && parseInt(form.list_price) > 0 && (
              <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
                <h4 className="text-sm font-medium text-green-400 mb-2">Your Savings with AIREA</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">Traditional Agent (6%)</div>
                    <div className="text-white font-semibold">
                      ${Math.round(parseInt(form.list_price) * 0.06).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">AIREA Flat Fee</div>
                    <div className="text-aire-400 font-semibold">$499</div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-green-500/20 text-center">
                  <span className="text-green-400 font-bold text-lg">
                    You save ${(Math.round(parseInt(form.list_price) * 0.06) - 499).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step: Review */}
        {currentStep === 'review' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Review Your Listing</h2>
              <p className="text-gray-400">Make sure everything looks good before publishing.</p>
            </div>

            {/* Summary Card */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              {photoPreviewUrls[0] && (
                <div className="h-48 overflow-hidden">
                  <img src={photoPreviewUrls[0]} alt="Primary" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-white">
                    {form.list_price ? `$${parseInt(form.list_price).toLocaleString()}` : 'Price not set'}
                  </h3>
                  {form.ai_estimated_value && (
                    <span className="text-sm text-gray-400">
                      AI est: ${form.ai_estimated_value.toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="text-gray-400 mb-1">
                  {form.street_address}{form.unit ? ` ${form.unit}` : ''}
                </p>
                <p className="text-gray-500 text-sm mb-4">
                  {form.city}, {form.state} {form.zip_code}
                </p>

                <div className="flex items-center space-x-4 text-sm text-gray-300 mb-4">
                  {form.beds && <span><i className="fas fa-bed mr-1 text-gray-500" /> {form.beds} bed</span>}
                  {form.baths && <span><i className="fas fa-bath mr-1 text-gray-500" /> {form.baths} bath</span>}
                  {form.sqft && <span><i className="fas fa-ruler-combined mr-1 text-gray-500" /> {parseInt(form.sqft).toLocaleString()} sqft</span>}
                  {form.year_built && <span><i className="fas fa-calendar mr-1 text-gray-500" /> {form.year_built}</span>}
                </div>

                {form.headline && (
                  <h4 className="text-white font-semibold mb-2">{form.headline}</h4>
                )}

                {(form.description || form.ai_generated_description) && (
                  <p className="text-gray-400 text-sm whitespace-pre-wrap">
                    {form.description || form.ai_generated_description}
                  </p>
                )}

                {form.features.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <div className="flex flex-wrap gap-2">
                      {form.features.map(f => (
                        <span key={f} className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300">{f}</span>
                      ))}
                    </div>
                  </div>
                )}

                {photos.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-800 text-sm text-gray-400">
                    <i className="fas fa-camera mr-1" /> {photos.length} photo{photos.length !== 1 ? 's' : ''} uploaded
                  </div>
                )}
              </div>
            </div>

            {/* Checklist */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-2">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Listing Checklist</h4>
              {[
                { done: !!form.street_address, label: 'Address entered' },
                { done: !!form.beds && !!form.baths && !!form.sqft, label: 'Property details complete' },
                { done: !!(form.description || form.ai_generated_description), label: 'Description added' },
                { done: photos.length > 0, label: 'Photos uploaded' },
                { done: !!form.list_price, label: 'Price set' },
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-2 text-sm">
                  <i className={`fas ${item.done ? 'fa-check-circle text-green-400' : 'fa-circle text-gray-600'}`} />
                  <span className={item.done ? 'text-gray-300' : 'text-gray-500'}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-800">
          <button
            onClick={goPrev}
            disabled={currentStepIndex === 0}
            className="px-6 py-3 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <i className="fas fa-arrow-left mr-2" /> Previous
          </button>

          {currentStep === 'review' ? (
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handlePublish(true)}
                disabled={saving}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition"
              >
                Save as Draft
              </button>
              <button
                onClick={() => handlePublish(false)}
                disabled={saving || !form.street_address || !form.city || !form.state || !form.zip_code}
                className="px-6 py-3 bg-aire-500 hover:bg-aire-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold rounded-lg transition flex items-center"
              >
                {saving ? (
                  <><i className="fas fa-spinner fa-spin mr-2" />Publishing...</>
                ) : (
                  <><i className="fas fa-rocket mr-2" />Publish Listing</>
                )}
              </button>
            </div>
          ) : (
            <button
              onClick={goNext}
              className="px-6 py-3 bg-aire-500 hover:bg-aire-600 text-white font-medium rounded-lg transition"
            >
              Continue <i className="fas fa-arrow-right ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
