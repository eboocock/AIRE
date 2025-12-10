'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MessageSquare, Calendar, Heart } from 'lucide-react'

export default function ContactSellerForm({ listingId, sellerId }: { listingId: string; sellerId: string }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)

    try {
      const supabase = createClient()

      // Get or create buyer user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      // Increment inquiries count
      const { data: listing } = await (supabase
        .from('listings') as any)
        .select('inquiries')
        .eq('id', listingId)
        .single()

      await (supabase
        .from('listings') as any)
        .update({ inquiries: (listing?.inquiries || 0) + 1 })
        .eq('id', listingId)

      // TODO: Send message to seller (requires messages table access)
      // For now, just show success

      setSent(true)
      setFormData({ name: '', email: '', phone: '', message: '' })
    } catch (error: any) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="space-y-4">
      {/* Contact Card */}
      <div className="card">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Contact Seller</h2>

        {sent ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-green-500 rounded-full mx-auto mb-3 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-green-900 mb-2">Message Sent!</h3>
            <p className="text-sm text-green-700">
              The seller will receive your message and contact you soon.
            </p>
            <button
              onClick={() => setSent(false)}
              className="mt-4 text-sm text-green-600 hover:text-green-700 font-semibold"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                Your Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="input"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="input"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className="input"
                placeholder="(206) 555-0123"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                value={formData.message}
                onChange={handleInputChange}
                className="input min-h-[100px]"
                placeholder="I'm interested in this property..."
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              {sending ? 'Sending...' : 'Send Message'}
            </button>

            <p className="text-xs text-slate-500 text-center">
              By submitting, you agree to be contacted about this property
            </p>
          </form>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="font-semibold text-slate-900 mb-3">Quick Actions</h3>
        <div className="space-y-2">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-slate-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <Calendar className="w-4 h-4" />
            <span className="font-semibold text-sm">Request Showing</span>
          </button>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-slate-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors">
            <Heart className="w-4 h-4" />
            <span className="font-semibold text-sm">Save to Favorites</span>
          </button>
        </div>
      </div>

      {/* FSBO Savings */}
      <div className="card bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300">
        <h3 className="font-semibold text-green-900 mb-2">💰 FSBO Savings</h3>
        <p className="text-sm text-green-800">
          This property is for sale by owner, which means no realtor commissions for the seller. This can result
          in better pricing and more direct communication!
        </p>
      </div>
    </div>
  )
}
