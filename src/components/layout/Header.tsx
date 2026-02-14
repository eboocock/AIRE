'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseClient();

    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-aire-400 to-aire-600 rounded-xl flex items-center justify-center">
              <i className="fas fa-robot text-white text-lg" />
            </div>
            <span className="text-2xl font-bold">AIRE</span>
            <span className="text-xs text-gray-500 hidden sm:block">
              AI Real Estate
            </span>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/#how-it-works"
              className="text-gray-400 hover:text-white transition"
            >
              How It Works
            </Link>
            <Link
              href="/#features"
              className="text-gray-400 hover:text-white transition"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="text-gray-400 hover:text-white transition"
            >
              Pricing
            </Link>

            {loading ? (
              <div className="w-20 h-10 bg-gray-800 rounded-lg animate-pulse" />
            ) : user ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="text-gray-400 hover:text-white transition"
                >
                  Dashboard
                </Link>
                <Link
                  href="/listings/new"
                  className="bg-aire-500 hover:bg-aire-600 text-white px-5 py-2 rounded-lg font-semibold transition"
                >
                  List My Home
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-400 hover:text-white transition"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="bg-aire-500 hover:bg-aire-600 text-white px-5 py-2 rounded-lg font-semibold transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden text-gray-400 hover:text-white">
            <i className="fas fa-bars text-xl" />
          </button>
        </div>
      </div>
    </nav>
  );
}
