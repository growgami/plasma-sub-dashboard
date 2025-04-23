'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const correctPassword = 'admin123'; // In a real app, this should be environment variable

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate a small delay for the loading effect
    await new Promise(resolve => setTimeout(resolve, 800));

    if (password === correctPassword) {
      router.push('/submissions');
    } else {
      setError('ACCESS DENIED');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,240,0.1),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      </div>

      <div className="relative w-96 backdrop-blur-xl bg-white/[0.01] rounded-2xl border border-cyan-500/10">
        {/* Glow effects */}
        <div className="absolute -inset-px bg-cyan-500/10 rounded-2xl blur-sm pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/[0.03] to-transparent opacity-50 pointer-events-none" />

        <div className="relative p-8">
          <h1 className="text-2xl font-bold mb-8 text-center text-white tracking-[0.2em] uppercase">
            System Access
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              {/* Background effects for input */}
              <div className="absolute inset-0 border border-cyan-400/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <div className="absolute inset-0 border-2 border-cyan-400/0 rounded-lg transition-all duration-300 group-focus-within:border-cyan-400/20 pointer-events-none" />
              
              {/* The actual input */}
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative w-full px-4 py-3 bg-black/40 border border-cyan-400/10 rounded-lg 
                         text-white placeholder-cyan-400/40
                         focus:outline-none focus:border-cyan-400/30 focus:ring-1 focus:ring-cyan-400/30
                         transition-all duration-300
                         font-mono tracking-wider
                         z-10"
                placeholder="ENTER ACCESS CODE"
                disabled={isLoading}
              />
              
              {/* Character indicators */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1 pointer-events-none">
                {password && [...Array(password.length)].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-1 h-4 bg-cyan-400/50 rounded-full animate-pulse"
                  />
                ))}
              </div>
            </div>

            {error && (
              <div className="relative">
                <div className="absolute inset-0 bg-red-500/10 blur-sm pointer-events-none" />
                <p className="relative text-red-500 text-sm text-center font-mono tracking-wider">
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full group"
            >
              <div className="absolute inset-0 bg-cyan-400/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none" />
              <div className="relative px-6 py-3 rounded-lg bg-cyan-400/5 text-cyan-400/90 border border-cyan-400/10 
                           hover:bg-cyan-400/10 hover:border-cyan-400/30 
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all duration-300
                           text-sm tracking-[0.3em] font-medium uppercase">
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4" 
                        fill="none" 
                      />
                      <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
                      />
                    </svg>
                    Authenticating
                  </div>
                ) : (
                  'Access System'
                )}
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 