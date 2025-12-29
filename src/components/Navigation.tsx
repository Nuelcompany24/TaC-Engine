import React from 'react';
import { AppView, UserProfile } from '../types';

interface NavigationProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  user: UserProfile | null;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange, user, onLogout }) => {
  // Define navigation items with role-based access
  const navItems = [
    { 
      id: AppView.DASHBOARD, 
      label: 'Portfolio Overview', 
      roles: ['BORROWER', 'LENDER', 'AUDITOR'],
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
        </svg>
      )
    },
    { 
      id: AppView.VERIFICATION, 
      label: 'Verify Impact', 
      roles: ['BORROWER', 'LENDER', 'AUDITOR'],
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      )
    },
    { 
      id: AppView.VISUAL, 
      label: 'Site Imagery', 
      roles: ['BORROWER', 'LENDER'],
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
        </svg>
      )
    },
    { 
      id: AppView.RISK, 
      label: 'Credit Simulator', 
      roles: ['BORROWER', 'LENDER'],
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      )
    },
  ];

  // Filter navigation items based on user's role
  const visibleItems = user?.role 
    ? navItems.filter(item => item.roles.includes(user.role))
    : navItems; // Fallback: show all if no user/role (e.g. during loading)

  return (
    <nav className="w-64 bg-[#0B1221] border-r border-slate-800 flex flex-col h-full sticky top-0">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">
          TaC Engine
        </h1>
        <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">Trust &bull; Verify &bull; Value</p>
      </div>

      <div className="flex-1 py-6 px-3 space-y-1">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3">
          Platform
        </div>
        {visibleItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
              currentView === item.id
                ? 'bg-slate-800/80 text-emerald-400 shadow-md shadow-black/20'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            <span className={`${currentView === item.id ? 'text-emerald-400' : 'text-slate-500'}`}>
              {item.icon}
            </span>
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </div>

      {/* User info and logout section */}
      <div className="mt-auto p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xs">
            {(user?.name || 'User').charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">{user?.name || 'Guest'}</div>
            <div className="text-xs text-slate-500 truncate">{user?.organization || 'No organization'}</div>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-3 text-slate-400 hover:text-red-400 transition text-sm py-2 border border-slate-700 rounded hover:border-red-500/30"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          Logout ({user?.role || 'Guest'})
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
