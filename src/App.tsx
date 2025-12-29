import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import VerificationAgent from './components/VerificationAgent';
import VisualAgent from './components/VisualAgent';
import RiskCalculator from './components/RiskCalculator';
import Onboarding from './components/Onboarding';
import { AppView, AuthState, UserProfile } from './types';
import { DataProvider } from './contexts/DataContext';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
  });

  const handleLogin = (profile: UserProfile) => {
    setAuth({
      isAuthenticated: true,
      user: profile,
    });
  };

  const handleLogout = () => {
    setAuth({
      isAuthenticated: false,
      user: null,
    });
    setCurrentView(AppView.DASHBOARD);
  };

  if (!auth.isAuthenticated) {
    return <Onboarding onComplete={handleLogin} />;
  }

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard onViewChange={setCurrentView} user={auth.user} />;
      case AppView.VERIFICATION:
        return <VerificationAgent />;
      case AppView.VISUAL:
        return <VisualAgent />;
      case AppView.RISK:
        return <RiskCalculator />;
      default:
        return <Dashboard onViewChange={setCurrentView} user={auth.user} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#030712] text-slate-200 overflow-hidden font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      <Navigation 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        user={auth.user}
        onLogout={handleLogout}
      />
      <main className="flex-1 overflow-y-auto bg-[#030712] relative">
        <div className="absolute top-0 left-0 w-full h-96 bg-emerald-900/5 pointer-events-none rounded-full blur-3xl opacity-50 transform -translate-y-1/2"></div>
        <div className="relative z-10">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
};

export default App;