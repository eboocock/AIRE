import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DashboardContent } from '@/components/dashboard/DashboardContent';

export const metadata = {
  title: 'Dashboard | AIRE',
  description: 'Manage your property listings',
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login?redirectTo=/dashboard');
  }

  // Fetch user's listings
  const { data: listings } = await supabase
    .from('listings')
    .select(`
      *,
      photos:listing_photos(id, url, is_primary),
      offers:offers(id, status),
      showings:showings(id, status)
    `)
    .eq('seller_id', user.id)
    .order('created_at', { ascending: false });

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Calculate stats
  const stats = {
    totalListings: listings?.length || 0,
    activeListings: listings?.filter(l => l.status === 'active').length || 0,
    totalViews: listings?.reduce((sum, l) => sum + (l.view_count || 0), 0) || 0,
    pendingOffers: listings?.reduce((sum, l) =>
      sum + (l.offers?.filter((o: any) => o.status === 'pending').length || 0), 0) || 0,
    upcomingShowings: listings?.reduce((sum, l) =>
      sum + (l.showings?.filter((s: any) => ['requested', 'confirmed'].includes(s.status)).length || 0), 0) || 0,
  };

  return (
    <DashboardContent
      user={user}
      profile={profile}
      listings={listings || []}
      stats={stats}
    />
  );
}
