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
  const [isRefreshing, setIsRefreshing] = useState(false);

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
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchUsers();
  };

  const handleExportCSV = () => {
    // Create CSV headers
    const headers = ['Position', 'Email', 'Referral Code', 'Referrals', 'Link Visits', 'Joined'];
    
    // Convert users data to CSV rows
    const csvRows = users.map(user => [
      user.position,
      user.email,
      user.referralCode,
      user.referralCount,
      user.linkVisits,
      new Date(user.createdAt).toLocaleDateString()
    ]);
    
    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n');
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `submissions-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white tracking-tight relative inline-block">
                Email Submissions
                <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-6 h-[1px] bg-white/20"></div>
              </h1>
              <p className="text-white/50 text-lg font-light tracking-wide mt-2">
                Track your referral campaign progress
              </p>
            </div>
            
            <button
              onClick={handleExportCSV}
              className="relative group"
            >
              <div className="absolute -inset-[1px] rounded-lg bg-cyan-400/0 transition-colors duration-300 group-hover:bg-cyan-400/20 blur-sm pointer-events-none" />
              <div className="relative flex items-center gap-2 px-6 py-2.5 rounded-lg bg-black/40 
                           border border-cyan-400/10 group-hover:border-cyan-400/50
                           text-cyan-400/90 
                           transition-all duration-300
                           text-sm tracking-[0.2em] font-medium uppercase">
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                  />
                </svg>
                Export CSV
              </div>
            </button>
          </div>
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
            <table className="min-w-full divide-y divide-cyan-500/[0.03]">
              <thead>
                <tr className="bg-black/40">
                  <th className="w-[100px] px-6 py-4 text-left">
                    <div className="text-xs font-medium text-cyan-400/60 uppercase tracking-[0.2em] relative group">
                      Position
                      <div className="absolute left-0 -bottom-1 w-0 h-[1px] bg-cyan-400/30 transition-all duration-300 group-hover:w-full"></div>
                    </div>
                  </th>
                  <th className="w-[400px] px-6 py-4 text-left">
                    <div className="text-xs font-medium text-cyan-400/60 uppercase tracking-[0.2em] relative group">
                      Email
                      <div className="absolute left-0 -bottom-1 w-0 h-[1px] bg-cyan-400/30 transition-all duration-300 group-hover:w-full"></div>
                    </div>
                  </th>
                  <th className="w-[180px] px-6 py-4 text-left">
                    <div className="text-xs font-medium text-cyan-400/60 uppercase tracking-[0.2em] relative group">
                      Referral Code
                      <div className="absolute left-0 -bottom-1 w-0 h-[1px] bg-cyan-400/30 transition-all duration-300 group-hover:w-full"></div>
                    </div>
                  </th>
                  <th className="w-[100px] px-6 py-4 text-left">
                    <div className="text-xs font-medium text-cyan-400/60 uppercase tracking-[0.2em] relative group">
                      Referrals
                      <div className="absolute left-0 -bottom-1 w-0 h-[1px] bg-cyan-400/30 transition-all duration-300 group-hover:w-full"></div>
                    </div>
                  </th>
                  <th className="w-[100px] px-6 py-4 text-left">
                    <div className="text-xs font-medium text-cyan-400/60 uppercase tracking-[0.2em] relative group">
                      Link Visits
                      <div className="absolute left-0 -bottom-1 w-0 h-[1px] bg-cyan-400/30 transition-all duration-300 group-hover:w-full"></div>
                    </div>
                  </th>
                  <th className="w-[120px] px-6 py-4 text-left">
                    <div className="text-xs font-medium text-cyan-400/60 uppercase tracking-[0.2em] relative group">
                      Joined
                      <div className="absolute left-0 -bottom-1 w-0 h-[1px] bg-cyan-400/30 transition-all duration-300 group-hover:w-full"></div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-500/[0.03]">
                {paginatedUsers.map((user, idx) => (
                  <tr 
                    key={user.email}
                    className={`
                      relative group
                      transition-all duration-500
                      hover:bg-cyan-400/[0.02]
                      ${idx % 2 === 0 ? 'bg-cyan-400/[0.01]' : 'bg-transparent'}
                    `}
                  >
                    <td className="w-[100px] px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm text-cyan-400/70 font-medium tracking-wider font-mono group-hover:text-cyan-400 transition-colors duration-300">
                          #{user.position.toString().padStart(3, '0')}
                        </span>
                      </div>
                    </td>
                    <td className="w-[400px] px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-white/80 group-hover:text-cyan-50 transition-colors duration-300">
                        {user.email}
                      </div>
                    </td>
                    <td className="w-[180px] px-6 py-5 whitespace-nowrap">
                      <div className="text-sm">
                        <span className="relative px-4 py-1.5 rounded-full bg-cyan-400/5 text-cyan-400/90 border border-cyan-400/10 font-medium tracking-wider group-hover:border-cyan-400/30 transition-all duration-500">
                          <div className="absolute inset-0 bg-cyan-400/5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 blur-md"></div>
                          {user.referralCode}
                        </span>
                      </div>
                    </td>
                    <td className="w-[100px] px-6 py-5 whitespace-nowrap">
                      <div className="text-sm">
                        <span className="text-cyan-400/90 font-semibold font-mono group-hover:text-cyan-400 transition-colors duration-300">
                          {user.referralCount.toString().padStart(2, '0')}
                        </span>
                      </div>
                    </td>
                    <td className="w-[100px] px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-cyan-400/80 font-medium font-mono group-hover:text-cyan-400 transition-colors duration-300">
                        {user.linkVisits.toString().padStart(3, '0')}
                      </div>
                    </td>
                    <td className="w-[120px] px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-cyan-400/50 font-mono group-hover:text-cyan-400/70 transition-colors duration-300">
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

        <div className="flex justify-between items-center gap-8 pt-8">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="relative px-6 py-2 rounded-full bg-cyan-400/5 text-cyan-400/80 border border-cyan-400/10 
                     disabled:opacity-30 disabled:cursor-not-allowed
                     hover:bg-cyan-400/10 hover:border-cyan-400/30 transition-all duration-500
                     tracking-[0.3em] text-sm group flex items-center gap-2"
          >
            <div className="absolute inset-0 bg-cyan-400/5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 blur-md"></div>
            <svg 
              className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <path 
                className="opacity-50" 
                fill="currentColor" 
                d="M12 4.75v1.5M17.127 6.873l-1.061 1.061M19.25 12h-1.5M17.127 17.127l-1.061-1.061M12 17.75v1.5M7.934 16.066l-1.061 1.061M6.25 12h-1.5M7.934 7.934L6.873 6.873"
              />
            </svg>
            REFRESH
          </button>
          <div className="flex items-center gap-8">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="relative px-6 py-2 rounded-full bg-cyan-400/5 text-cyan-400/80 border border-cyan-400/10 
                       disabled:opacity-30 disabled:cursor-not-allowed
                       hover:bg-cyan-400/10 hover:border-cyan-400/30 transition-all duration-500
                       tracking-[0.3em] text-sm group"
            >
              <div className="absolute inset-0 bg-cyan-400/5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 blur-md"></div>
              PREV
            </button>
            <span className="text-cyan-400/50 tracking-[0.3em] text-sm font-mono">
              {currentPage.toString().padStart(2, '0')} / {totalPages.toString().padStart(2, '0')}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="relative px-6 py-2 rounded-full bg-cyan-400/5 text-cyan-400/80 border border-cyan-400/10 
                       disabled:opacity-30 disabled:cursor-not-allowed
                       hover:bg-cyan-400/10 hover:border-cyan-400/30 transition-all duration-500
                       tracking-[0.3em] text-sm group"
            >
              <div className="absolute inset-0 bg-cyan-400/5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 blur-md"></div>
              NEXT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionTable; 