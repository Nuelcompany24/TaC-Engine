import React, { createContext, useContext, useState, ReactNode } from 'react';
import { VerificationRecord, SystemLog, RiskMetrics } from '../types';

interface DataContextType {
  verifications: VerificationRecord[];
  logs: SystemLog[];
  riskProfile: RiskMetrics;
  addVerification: (record: Omit<VerificationRecord, 'id' | 'timestamp'>) => void;
  addLog: (log: Omit<SystemLog, 'id' | 'timestamp'>) => void;
  updateRiskProfile: (metrics: Partial<RiskMetrics>) => void;
  stats: {
    totalValueLocked: number;
    pendingVerifications: number;
  };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // "Database" State
  const [verifications, setVerifications] = useState<VerificationRecord[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([
    { id: '0', timestamp: new Date(Date.now() - 1000000), level: 'INFO', message: 'System initialized.', source: 'System' }
  ]);
  const [riskProfile, setRiskProfile] = useState<RiskMetrics>({
    baseInterestRate: 12.0,
    sustainabilityScore: 65,
    verificationConfidence: 0.70,
    collateralValue: 120000
  });

  // Actions
  const addVerification = (record: Omit<VerificationRecord, 'id' | 'timestamp'>) => {
    const newRecord = {
      ...record,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    };
    setVerifications(prev => [newRecord, ...prev]);
    
    // Simulate updating risk score based on successful verification
    const impactBoost = 5; 
    setRiskProfile(prev => ({
      ...prev,
      sustainabilityScore: Math.min(100, prev.sustainabilityScore + impactBoost),
      verificationConfidence: Math.min(0.99, prev.verificationConfidence + 0.05),
      collateralValue: prev.collateralValue + 5000
    }));

    addLog({
      level: 'SUCCESS',
      message: `Verification completed for query: "${record.query.substring(0, 30)}..."`,
      source: 'Verification Agent'
    });
  };

  const addLog = (log: Omit<SystemLog, 'id' | 'timestamp'>) => {
    const newLog = {
      ...log,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const updateRiskProfile = (metrics: Partial<RiskMetrics>) => {
    setRiskProfile(prev => ({ ...prev, ...metrics }));
  };

  // Derived Stats
  const stats = {
    totalValueLocked: riskProfile.collateralValue,
    pendingVerifications: Math.floor(Math.random() * 3) + 1, // Simulated pending state
  };

  return (
    <DataContext.Provider value={{ verifications, logs, riskProfile, addVerification, addLog, updateRiskProfile, stats }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};