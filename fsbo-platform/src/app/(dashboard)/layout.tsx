import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardNav from '@/components/dashboard/DashboardNav'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // Get user profile
  const { data: userProfile } = await supabase
    .from('users')
    .select('*')
    .eq('auth_user_id', session.user.id)
    .single()

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNav user={session.user} userProfile={userProfile} />
      <main>{children}</main>
    </div>
  )
}
