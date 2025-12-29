// src/components/Dashboard.tsx
import React from 'react';
import { UserProfile } from '../types';
import { useData } from '../contexts/DataContext';

interface DashboardProps {
  onViewChange: (view: any) => void;
  user: UserProfile | null;
}

const Dashboard: React.FC<DashboardProps> = ({ onViewChange, user }) => {
  const { riskProfile, verifications, stats } = useData();

  const role = user?.role || 'BORROWER'; // Safe fallback

  // Calculate discount/savings (used differently per role)
  const discount = (riskProfile.sustainabilityScore * riskProfile.verificationConfidence * 0.05);
  const savings = discount.toFixed(2);

  // Role-specific content
  const getRoleSpecificContent = () => {
    if (role === 'BORROWER') {
      return {
        welcomeMessage: "Your sustainability data is currently optimizing your credit profile.",
        card1Title: "Unlocked Credit Capacity",
        card1Subtitle: "vs. unverified collateral",
        card2Title: "Interest Rate Reduction",
        card2Value: `-${savings}%`,
        card2Color: "text-amber-400",
        card2Description: `Based on ${(riskProfile.verificationConfidence * 100).toFixed(0)}% Confidence verification score of ${riskProfile.sustainabilityScore}/100.`,
        actionCenterTitle: "Increase your collateral",
        actionCenterText: "Upload new site imagery or run a search verification on your latest sustainability report to unlock more value.",
        actionCenterButton: "Start New Verification",
        actionCenterView: 'VERIFICATION' as const,
      };
    }

    if (role === 'LENDER') {
      return {
        welcomeMessage: "Portfolio risk analysis based on real-time verification layers.",
        card1Title: "Total Verified Exposure",
        card1Subtitle: "across sustainability-linked loans",
        card2Title: "Portfolio Yield Boost",
        card2Value: `+${savings}%`,
        card2Color: "text-emerald-400",
        card2Description: "Effective yield improvement from verified sustainability performance across your portfolio.",
        actionCenterTitle: "Assess New Opportunities",
        actionCenterText: "Review pending projects and run risk simulations on new borrowers to identify high-impact investments.",
        actionCenterButton: "Review Pipeline",
        actionCenterView: 'RISK' as const,
      };
    }

    // AUDITOR or any other role
    return {
      welcomeMessage: "Monitoring system integrity and verification audit trails.",
      card1Title: "Active Verification Agents",
      card1Subtitle: "processing sustainability claims",
      card2Title: "Average Confidence Score",
      card2Value: `${(riskProfile.verificationConfidence * 100).toFixed(0)}%`,
      card2Color: "text-cyan-400",
      card2Description: "System-wide confidence in grounded sustainability claims.",
      actionCenterTitle: "Run System Audit",
      actionCenterText: "Perform a full verification chain integrity check across all projects.",
      actionCenterButton: "Start Audit",
      actionCenterView: 'VERIFICATION' as const,
    };
  };

  const content = getRoleSpecificContent();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.name.split(' ')[0] || 'User'}
          </h2>
          <p className="text-slate-400">
            {content.welcomeMessage}
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-emerald-900/20 border border-emerald-500/20 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs text-emerald-400 font-medium">Engine Active</span>
        </div>
      </header>

      {/* Main Value Proposition Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card 1: Core Metric */}
        <div className="bg-gradient-to-br from-[#1F2937] to-[#111827] p-6 rounded-2xl border border-slate-700 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-24 h-24 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1v22m9-13h-4.37a4 4 0 01-3.27-1.7l-2.62-3.88a2 2 0 00-1.64-.84H5a2 2 0 00-2 2v6a2 2 0 002 2h4.13a4 4 0 013.27 1.7l2.62 3.88a2 2 0 001.64.84h4.37"></path>
            </svg>
          </div>
          <div className="relative z-10">
            <div className="text-slate-400 text-sm font-medium mb-1 flex items-center gap-2">
              {content.card1Title}
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="text-4xl font-bold text-white tracking-tight">
              ${stats.totalValueLocked.toLocaleString()}
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-medium border border-emerald-500/20">
                +{(riskProfile.sustainabilityScore / 10).toFixed(1)}% Verified
              </span>
              <span className="text-slate-500">{content.card1Subtitle}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Role-specific Benefit */}
        <div className="bg-[#111827] p-6 rounded-2xl border border-slate-700 relative group hover:border-amber-500/30 transition-colors">
          <div className="text-slate-400 text-sm font-medium mb-1">
            {content.card2Title}
          </div>
          <div className={`text-4xl font-bold tracking-tight ${content.card2Color}`}>
            {content.card2Value}
          </div>
          <div className="mt-4 text-sm text-slate-500">
            <p>{content.card2Description}</p>
          </div>
          {(role === 'BORROWER' || role === 'LENDER') && (
            <div className="absolute bottom-4 right-4">
              <button onClick={() => onViewChange('RISK')} className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1">
                Simulate <span className="text-lg">→</span>
              </button>
            </div>
          )}
        </div>

        {/* Card 3: Pending Verifications */}
        <div className="bg-[#111827] p-6 rounded-2xl border border-slate-700 relative">
          <div className="text-slate-400 text-sm font-medium mb-1">Pending Verifications</div>
          <div className="text-4xl font-bold text-white tracking-tight">
            {stats.pendingVerifications}
          </div>
          <div className="mt-4 text-sm text-slate-500">
            <p>{stats.pendingVerifications} Satellite scans queued</p>
          </div>
          <div className="absolute bottom-4 right-4">
            <button onClick={() => onViewChange('VERIFICATION')} className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1">
              View Agents <span className="text-lg">→</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Impact Verification Trail */}
        <div className="bg-[#0B1221] rounded-2xl border border-slate-800 p-6 min-h-[300px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Impact Verification Trail
            </h3>
            {verifications.length > 0 && <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">{verifications.length} records</span>}
          </div>

          <div className="space-y-4">
            {verifications.length === 0 ? (
              <div className="text-center py-10 text-slate-500">
                <p>No verifications run yet.</p>
                <button onClick={() => onViewChange('VERIFICATION')} className="text-emerald-400 hover:underline text-sm mt-2">
                  Run your first verification audit
                </button>
              </div>
            ) : (
              verifications.slice(0, 4).map((record) => (
                <div key={record.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-800 animate-fade-in">
                  <div className="mt-1 w-2 h-2 rounded-full bg-emerald-500 shadow shadow-emerald-500/50"></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <p className="text-sm text-slate-200 font-medium truncate">{record.query}</p>
                      <span className="text-[10px] text-slate-500">{record.timestamp.toLocaleTimeString()}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{record.text.substring(0, 100)}...</p>
                    <div className="mt-2 flex gap-2">
                      {record.sources.slice(0, 2).map((s, i) => (
                        <span key={i} className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700 truncate max-w-[150px]">
                          {s.title || new URL(s.uri).hostname}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}

            {verifications.length === 0 && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-800 opacity-50">
                <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 shadow shadow-blue-500/50"></div>
                <div>
                  <p className="text-sm text-slate-200">System Initialized</p>
                  <p className="text-xs text-slate-500 mt-1">Ready to ingest sustainability data.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Center */}
        <div className="bg-gradient-to-b from-emerald-900/10 to-[#0B1221] rounded-2xl border border-slate-800 p-6 flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">🚀</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{content.actionCenterTitle}</h3>
          <p className="text-slate-400 text-sm mb-6 max-w-sm">
            {content.actionCenterText}
          </p>
          <button
            onClick={() => onViewChange(content.actionCenterView)}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors shadow-lg shadow-emerald-900/20"
          >
            {content.actionCenterButton}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;