import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import EditListingClient from '@/components/listing/EditListingClient'

export default async function EditListingPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // Get the listing
  const { data: listing, error } = await (supabase
    .from('listings') as any)
    .select('*')
    .eq('id', params.id)
    .eq('user_id', session.user.id) // Ensure user owns this listing
    .single()

  if (error || !listing) {
    redirect('/dashboard/listings')
  }

  return <EditListingClient listing={listing} />
}
