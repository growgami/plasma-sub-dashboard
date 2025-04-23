'use client';

import { useEffect, useState, useMemo } from 'react';

interface User {
  email: string;
  referralCode: string;
  referralCount: number;
  linkVisits: number;
  position: number;
  createdAt: string;
}

const ITEMS_PER_PAGE = 10;

const SubmissionTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        const sortedUsers = data.users.sort((a: User, b: User) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setUsers(sortedUsers);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return users.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [users, currentPage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border border-white/20 rounded-full animate-[spin_3s_linear_infinite]" />
            <div className="w-16 h-16 border-t border-white/40 rounded-full animate-[spin_2s_linear_infinite] absolute inset-0" />
            <div className="w-16 h-16 border-t border-white/60 rounded-full animate-spin absolute inset-0" />
          </div>
          <div className="text-white/70 text-lg font-light tracking-[0.5em] animate-pulse">
            LOADING
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="relative bg-white/5 backdrop-blur-xl px-8 py-6 rounded border border-white/10">
          <div className="absolute -inset-[1px] bg-white/10 blur-sm -z-10"></div>
          <div className="text-lg font-medium mb-2 text-white/90 tracking-wider">SYSTEM ERROR</div>
          <div className="text-white/70 font-mono">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8 selection:bg-white/20">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="space-y-3 relative">
          <div className="absolute -left-4 top-0 w-[2px] h-full">
            <div className="w-full h-full bg-gradient-to-b from-white/5 via-white/20 to-white/5"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-white/30 blur-sm"></div>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight relative inline-block">
            Email Submissions
            <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-6 h-[1px] bg-white/20"></div>
          </h1>
          <p className="text-white/50 text-lg font-light tracking-wide">
            Track your referral campaign progress
          </p>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-3xl"></div>
          <div className="absolute -inset-px bg-gradient-to-r from-white/[0.05] to-transparent"></div>
          <div className="absolute top-0 left-0 w-full h-px">
            <div className="relative w-full h-full bg-gradient-to-r from-white/5 via-white/20 to-white/5">
              <div className="absolute inset-0 bg-white/30 blur-sm"></div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-px">
            <div className="relative w-full h-full bg-gradient-to-r from-white/5 via-white/20 to-white/5">
              <div className="absolute inset-0 bg-white/30 blur-sm"></div>
            </div>
          </div>
          
          <div className="overflow-x-auto relative">
            <table className="min-w-full divide-y divide-white/[0.03]">
              <thead>
                <tr className="bg-black/40">
                  <th className="w-[100px] px-6 py-4 text-left">
                    <div className="text-xs font-medium text-white/40 uppercase tracking-[0.2em] relative group">
                      Position
                      <div className="absolute left-0 -bottom-1 w-0 h-[1px] bg-white/30 transition-all duration-300 group-hover:w-full"></div>
                    </div>
                  </th>
                  <th className="w-[400px] px-6 py-4 text-left">
                    <div className="text-xs font-medium text-white/40 uppercase tracking-[0.2em] relative group">
                      Email
                      <div className="absolute left-0 -bottom-1 w-0 h-[1px] bg-white/30 transition-all duration-300 group-hover:w-full"></div>
                    </div>
                  </th>
                  <th className="w-[180px] px-6 py-4 text-left">
                    <div className="text-xs font-medium text-white/40 uppercase tracking-[0.2em] relative group">
                      Referral Code
                      <div className="absolute left-0 -bottom-1 w-0 h-[1px] bg-white/30 transition-all duration-300 group-hover:w-full"></div>
                    </div>
                  </th>
                  <th className="w-[100px] px-6 py-4 text-left">
                    <div className="text-xs font-medium text-white/40 uppercase tracking-[0.2em] relative group">
                      Referrals
                      <div className="absolute left-0 -bottom-1 w-0 h-[1px] bg-white/30 transition-all duration-300 group-hover:w-full"></div>
                    </div>
                  </th>
                  <th className="w-[100px] px-6 py-4 text-left">
                    <div className="text-xs font-medium text-white/40 uppercase tracking-[0.2em] relative group">
                      Link Visits
                      <div className="absolute left-0 -bottom-1 w-0 h-[1px] bg-white/30 transition-all duration-300 group-hover:w-full"></div>
                    </div>
                  </th>
                  <th className="w-[120px] px-6 py-4 text-left">
                    <div className="text-xs font-medium text-white/40 uppercase tracking-[0.2em] relative group">
                      Joined
                      <div className="absolute left-0 -bottom-1 w-0 h-[1px] bg-white/30 transition-all duration-300 group-hover:w-full"></div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {paginatedUsers.map((user, idx) => (
                  <tr 
                    key={user.email}
                    className={`
                      relative group
                      transition-all duration-500
                      hover:bg-white/[0.03]
                      ${idx % 2 === 0 ? 'bg-white/[0.01]' : 'bg-transparent'}
                    `}
                  >
                    <td className="w-[100px] px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm text-white/70 font-medium tracking-wider font-mono group-hover:text-white transition-colors duration-300">
                          #{user.position.toString().padStart(3, '0')}
                        </span>
                      </div>
                    </td>
                    <td className="w-[400px] px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-white/80 group-hover:text-white transition-colors duration-300">
                        {user.email}
                      </div>
                    </td>
                    <td className="w-[180px] px-6 py-5 whitespace-nowrap">
                      <div className="text-sm">
                        <span className="relative px-4 py-1.5 rounded-full bg-white/5 text-white/80 border border-white/10 font-medium tracking-wider group-hover:border-white/30 transition-all duration-500">
                          <div className="absolute inset-0 bg-white/5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 blur-md"></div>
                          {user.referralCode}
                        </span>
                      </div>
                    </td>
                    <td className="w-[100px] px-6 py-5 whitespace-nowrap">
                      <div className="text-sm">
                        <span className="text-white/90 font-semibold font-mono group-hover:text-white transition-colors duration-300">
                          {user.referralCount.toString().padStart(2, '0')}
                        </span>
                      </div>
                    </td>
                    <td className="w-[100px] px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-white/80 font-medium font-mono group-hover:text-white transition-colors duration-300">
                        {user.linkVisits.toString().padStart(3, '0')}
                      </div>
                    </td>
                    <td className="w-[120px] px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-white/50 font-mono group-hover:text-white/70 transition-colors duration-300">
                        {new Date(user.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        }).replace(/\//g, '/')}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-center items-center gap-8 pt-8">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="relative px-6 py-2 rounded-full bg-white/5 text-white/80 border border-white/10 
                     disabled:opacity-30 disabled:cursor-not-allowed
                     hover:bg-white/10 hover:border-white/30 transition-all duration-500
                     tracking-[0.3em] text-sm group"
          >
            <div className="absolute inset-0 bg-white/5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 blur-md"></div>
            PREV
          </button>
          <span className="text-white/50 tracking-[0.3em] text-sm font-mono">
            {currentPage.toString().padStart(2, '0')} / {totalPages.toString().padStart(2, '0')}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="relative px-6 py-2 rounded-full bg-white/5 text-white/80 border border-white/10 
                     disabled:opacity-30 disabled:cursor-not-allowed
                     hover:bg-white/10 hover:border-white/30 transition-all duration-500
                     tracking-[0.3em] text-sm group"
          >
            <div className="absolute inset-0 bg-white/5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 blur-md"></div>
            NEXT
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmissionTable; 