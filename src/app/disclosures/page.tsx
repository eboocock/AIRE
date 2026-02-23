import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function DisclosuresPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?redirectTo=/disclosures');

  const { data: sessions } = await supabase
    .from('disclosure_sessions')
    .select('*, form:disclosure_forms(form_name, form_code, state)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const statusColor = (status: string) => {
    if (status === 'signed') return 'text-green-400 bg-green-500/10 border-green-500/20';
    if (status === 'complete') return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
  };

  const statusLabel = (status: string) => {
    if (status === 'signed') return 'Signed';
    if (status === 'complete') return 'Ready to Sign';
    return 'In Progress';
  };

  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/dashboard" className="text-gray-400 hover:text-white text-sm flex items-center gap-2 mb-2">
              <i className="fas fa-arrow-left" /> Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-white">Seller Disclosures</h1>
            <p className="text-gray-400 mt-1">Generate legally accurate disclosure documents for your property.</p>
          </div>
          <Link
            href="/disclosures/new"
            className="inline-flex items-center gap-2 bg-aire-500 hover:bg-aire-600 text-white px-5 py-3 rounded-xl font-semibold transition"
          >
            <i className="fas fa-plus" /> New Disclosure
          </Link>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-8 flex gap-4">
          <i className="fas fa-info-circle text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-blue-300 text-sm font-medium">About Seller Disclosures</p>
            <p className="text-blue-200/70 text-sm mt-1">
              Washington State law (RCW 64.06) requires sellers to disclose known material defects before accepting an offer.
              Complete your disclosure early — buyers will receive a copy and have 3 business days to rescind after receiving it.
            </p>
          </div>
        </div>

        {/* Sessions List */}
        {!sessions || sessions.length === 0 ? (
          <div className="text-center py-20 bg-gray-900 border border-gray-800 rounded-2xl">
            <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-file-contract text-gray-600 text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No disclosures yet</h3>
            <p className="text-gray-400 mb-6 max-w-sm mx-auto">
              Start your seller disclosure to generate a legally accurate document in minutes.
            </p>
            <Link
              href="/disclosures/new"
              className="inline-flex items-center gap-2 bg-aire-500 hover:bg-aire-600 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              <i className="fas fa-plus" /> Start a Disclosure
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session: any) => (
              <Link
                key={session.id}
                href={`/disclosures/${session.id}`}
                className="block bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl p-5 transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-aire-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-file-contract text-aire-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">{session.property_address}</div>
                      <div className="text-sm text-gray-400 mt-0.5">{session.form?.form_name}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(session.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right hidden sm:block">
                      <div className="text-sm text-gray-400">{session.completion_percentage || 0}% complete</div>
                      <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full bg-aire-500 rounded-full"
                          style={{ width: `${session.completion_percentage || 0}%` }}
                        />
                      </div>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${statusColor(session.status)}`}>
                      {statusLabel(session.status)}
                    </span>
                    <i className="fas fa-chevron-right text-gray-600" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Available Forms */}
        <div className="mt-12">
          <h2 className="text-lg font-semibold text-white mb-4">Available Disclosure Forms</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { code: 'WA_FORM_17', name: 'WA Seller Disclosure (Form 17)', desc: 'Required for all WA residential sales — covers 9 major categories, 34 questions', icon: 'fa-file-contract', badge: 'Washington State' },
              { code: 'FEDERAL_LEAD_PAINT', name: 'Lead-Based Paint Disclosure', desc: 'Federal requirement for homes built before 1978', icon: 'fa-exclamation-triangle', badge: 'Federal' },
            ].map(form => (
              <div key={form.code} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className={`fas ${form.icon} text-gray-400`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-white text-sm">{form.name}</span>
                      <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">{form.badge}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{form.desc}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="bg-gray-900 border border-dashed border-gray-700 rounded-xl p-4 flex items-center gap-3 opacity-50">
              <div className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                <i className="fas fa-plus text-gray-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">More states coming soon</div>
                <p className="text-xs text-gray-600 mt-0.5">CA, TX, FL, NY disclosures in development</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
