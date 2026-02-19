'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase/client';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Completing sign in...');

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = getSupabaseClient();
      const code = searchParams.get('code');
      const redirectTo = searchParams.get('redirectTo') || '/dashboard';

      // PKCE flow - exchange code for session
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
          setStatus('success');
          setMessage('Sign in successful! Redirecting...');
          setTimeout(() => router.push(redirectTo), 500);
          return;
        }
        setStatus('error');
        setMessage('Failed to complete sign in. Please try again.');
        setTimeout(() => router.push('/login?error=auth_callback_error'), 2000);
        return;
      }

      // Token-based flow - check for hash params (email verification)
      const hash = window.location.hash;

      if (hash && hash.includes('access_token')) {
        // Supabase client auto-handles token-based auth from hash
        // Give it a moment to process, then check session
        await new Promise(resolve => setTimeout(resolve, 500));

        const { data: { session }, error } = await supabase.auth.getSession();

        if (session && !error) {
          setStatus('success');
          setMessage('Email verified! Redirecting...');
          setTimeout(() => router.push('/dashboard'), 500);
          return;
        }
      }

      // Check for error in hash (e.g., #error=access_denied)
      if (hash && hash.includes('error')) {
        const params = new URLSearchParams(hash.substring(1));
        const errorDesc = params.get('error_description') || 'Authentication failed';
        setStatus('error');
        setMessage(decodeURIComponent(errorDesc.replace(/\+/g, ' ')));
        setTimeout(() => router.push('/login?error=auth_callback_error'), 2000);
        return;
      }

      // Check if we already have a session
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setStatus('success');
        setMessage('Already signed in! Redirecting...');
        setTimeout(() => router.push('/dashboard'), 500);
        return;
      }

      // No session and no auth data - something went wrong
      setStatus('error');
      setMessage('Authentication failed. Please try again.');
      setTimeout(() => router.push('/login?error=auth_callback_error'), 2000);
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        {status === 'loading' && (
          <>
            <div className="w-12 h-12 border-4 border-aire-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">{message}</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-green-400">{message}</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-red-400">{message}</p>
          </>
        )}
      </div>
    </div>
  );
}
