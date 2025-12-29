import React, { useState } from 'react';
import { UserRole, UserProfile } from '../types';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<UserRole>(null);
  const [name, setName] = useState('');
  const [org, setOrg] = useState('');

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role && name && org) {
      onComplete({ role, name, organization: org });
    }
  };

  // Demo quick login handlers
  const handleDemoBorrower = () => {
    onComplete({
      role: 'BORROWER',
      name: 'Alex Rivera',
      organization: 'GreenFarm Co-op',
    });
  };

  const handleDemoLender = () => {
    onComplete({
      role: 'LENDER',
      name: 'Sarah Chen',
      organization: 'EcoCapital Bank',
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-emerald-900/20 to-transparent pointer-events-none"></div>

      <div className="max-w-xl w-full relative z-10">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-200 to-amber-300 mb-4">
            TaC Engine
          </h1>
          <p className="text-slate-400 text-lg">
            Transition as Collateral. <br />
            Convert your sustainability progress into financial liquidity.
          </p>
        </div>

        {/* Step 1: Role Selection */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl text-white font-semibold text-center mb-6">Select your profile</h2>

            <button
              onClick={() => handleRoleSelect('BORROWER')}
              className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 p-6 rounded-xl text-left transition-all group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">Project Developer / SME</h3>
                  <p className="text-slate-400 text-sm mt-1">I want to lower my interest rates by proving my impact.</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                  </svg>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleRoleSelect('LENDER')}
              className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/50 p-6 rounded-xl text-left transition-all group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">Financial Institution</h3>
                  <p className="text-slate-400 text-sm mt-1">I want to de-risk my portfolio using verified ESG data.</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
            </button>

            {/* Demo Quick Login Section */}
            <div className="mt-10 pt-8 border-t border-slate-800">
              <p className="text-center text-slate-500 text-sm mb-4">Or try demo mode instantly</p>
              <div className="space-y-3">
                <button
                  onClick={handleDemoBorrower}
                  className="w-full bg-emerald-900/30 hover:bg-emerald-900/50 border border-emerald-800 p-4 rounded-lg text-sm text-emerald-300 transition-all flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                  </svg>
                  Continue as Demo Borrower (Alex Rivera)
                </button>

                <button
                  onClick={handleDemoLender}
                  className="w-full bg-amber-900/30 hover:bg-amber-900/50 border border-amber-800 p-4 rounded-lg text-sm text-amber-300 transition-all flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Continue as Demo Lender (Sarah Chen)
                </button>
              </div>
              <p className="text-center text-xs text-slate-600 mt-4">Demo mode • Switch roles anytime via logout</p>
            </div>
          </div>
        )}

        {/* Step 2: Profile Form */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="bg-slate-900 p-8 rounded-xl border border-slate-700 animate-fade-in">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-slate-500 hover:text-white mb-6 text-sm flex items-center gap-1"
            >
              ← Back to role selection
            </button>

            <h2 className="text-2xl font-bold text-white mb-2">Create Secure Account</h2>
            <p className="text-slate-400 text-sm mb-6">
              Your data is encrypted and used solely for impact verification.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  placeholder="e.g. Jane Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Organization / Farm Name</label>
                <input
                  required
                  type="text"
                  value={org}
                  onChange={(e) => setOrg(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                  placeholder="e.g. Green Valley Solar Coop"
                />
              </div>

              <div className="bg-emerald-900/20 border border-emerald-900/50 p-3 rounded-lg flex items-start gap-3">
                <svg className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                <p className="text-xs text-emerald-100/80">
                  <strong>Bank-Grade Security:</strong> TaC Engine uses zero-knowledge proofs where possible. We never sell your raw data to third parties.
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-emerald-900/30 transition-all mt-4"
              >
                Access Platform
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Onboarding;