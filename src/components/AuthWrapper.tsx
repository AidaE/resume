import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import { LogIn, UserPlus, Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setError('');

    try {
      if (authMode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin
          }
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    // Clear any cached data when user signs out
    if (typeof window !== 'undefined') {
      // Clear any localStorage or sessionStorage if used
      localStorage.clear();
      sessionStorage.clear();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <img 
          src="/clouds.jpg" 
          alt="Clouds background"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin relative z-10"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-4">
        <img 
          src="/clouds.jpg" 
          alt="Clouds background"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        {/* Gradient white overlay - transparent at top, 80% at bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/80 z-5"></div>
        <div className="w-full max-w-md relative z-10">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Turquoise gradient header */}
            <div className=" p-8 pb-4">
              <div className="text-center">
                <img 
                  src="/logo.png" 
                  alt="ResumeBuilder Logo"
                  className="w-16 h-16 mx-auto mb-4"
                />
                <h1 className="text-2xl font-bold text-gray-900">The Tailored CV</h1>
                <p className="text-gray-600 mt-2">
                  {authMode === 'signin' ? 'Welcome back!' : 'Create your account'}
                </p>
              </div>
            </div>
            
            {/* White form section */}
            <div className="p-8 pt-4">
              <form onSubmit={handleAuth} className="space-y-6">
                <div>
                  {/* <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label> */}
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full placeholder-gray-500  pl-10 pr-4 py-2.5 bg-[#F1F3F8] rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none transition-colors"
                      placeholder="Email address"
                      required
                    />
                  </div>
                </div>

                <div>
                  {/* <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label> */}
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full placeholder-gray-500 pl-10 pr-12 py-2.5 bg-[#F1F3F8] rounded-lg focus:ring-2 focus:ring-gray-500 focus:outline-none transition-colors"
                      placeholder="Password"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:bg-gray-300 transition-colors font-medium"
                >
                  {authLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                     
                      {authMode === 'signin' ? 'Sign In' : 'Create Account'}
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
                    setError('');
                  }}
                  className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                >
                  {authMode === 'signin' 
                    ? "Don't have an account? Sign up" 
                    : "Already have an account? Sign in"
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {children}
    </div>
  );
};