'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { MoreVertical, Edit, Eye, Trash2, Copy, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface ListingActionsProps {
  listingId: string
  status: string
}

export default function ListingActions({ listingId, status }: ListingActionsProps) {
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      return
    }

    setDeleting(true)
    try {
      const supabase = createClient()
      const { error } = await (supabase.from('listings') as any).delete().eq('id', listingId)

      if (error) throw error

      router.refresh()
    } catch (error: any) {
      console.error('Error deleting listing:', error)
      alert('Failed to delete listing: ' + error.message)
    } finally {
      setDeleting(false)
      setShowMenu(false)
    }
  }

  const handleDuplicate = async () => {
    try {
      const supabase = createClient()

      // Get the listing to duplicate
      const { data: listing, error: fetchError } = await (supabase
        .from('listings') as any)
        .select('*')
        .eq('id', listingId)
        .single()

      if (fetchError) throw fetchError

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('Not authenticated')

      // Create a copy with modified title
      const duplicate = {
        ...listing,
        id: undefined,
        user_id: user.id,
        status: 'draft',
        slug: null,
        published_at: null,
        created_at: undefined,
        updated_at: undefined,
        views: 0,
        favorites: 0,
        inquiries: 0,
        address_line1: `${listing.address_line1} (Copy)`,
      }

      const { error: insertError } = await (supabase.from('listings') as any).insert(duplicate)

      if (insertError) throw insertError

      router.refresh()
      alert('Listing duplicated successfully!')
    } catch (error: any) {
      console.error('Error duplicating listing:', error)
      alert('Failed to duplicate listing: ' + error.message)
    } finally {
      setShowMenu(false)
    }
  }

  const copyListingUrl = () => {
    // TODO: Generate actual public URL when public pages are built
    const url = `${window.location.origin}/listing/${listingId}`
    navigator.clipboard.writeText(url)
    alert('Listing URL copied to clipboard!')
    setShowMenu(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
      >
        <MoreVertical className="w-5 h-5 text-slate-600" />
      </button>

      {showMenu && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />

          {/* Dropdown Menu */}
          <div className="absolute right-0 top-10 z-20 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2">
            {status === 'active' && (
              <Link
                href={`/listing/${listingId}`}
                className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                onClick={() => setShowMenu(false)}
              >
                <ExternalLink className="w-4 h-4" />
                View Public Page
              </Link>
            )}

            <Link
              href={`/dashboard/listings/${listingId}/edit`}
              className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
              onClick={() => setShowMenu(false)}
            >
              <Edit className="w-4 h-4" />
              Edit Listing
            </Link>

            {status === 'active' && (
              <button
                onClick={copyListingUrl}
                className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors w-full text-left"
              >
                <Copy className="w-4 h-4" />
                Copy Link
              </button>
            )}

            <button
              onClick={handleDuplicate}
              className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors w-full text-left"
            >
              <Copy className="w-4 h-4" />
              Duplicate
            </button>

            <div className="border-t border-slate-200 my-2" />

            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
