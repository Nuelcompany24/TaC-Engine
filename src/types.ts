export interface AgentStatus {
  id: string;
  name: string;
  role: 'VERIFICATION' | 'QUANTIFICATION' | 'VISUAL' | 'CONTRACT';
  status: 'idle' | 'processing' | 'success' | 'error';
  lastActivity: string;
}

export interface VerificationResult {
  text: string;
  sources: Array<{
    uri: string;
    title: string;
  }>;
}

export interface VerificationRecord extends VerificationResult {
  id: string;
  timestamp: Date;
  query: string;
  confidenceScore: number;
}

export interface SystemLog {
  id: string;
  timestamp: Date;
  level: 'INFO' | 'WARN' | 'SUCCESS' | 'ERROR';
  message: string;
  source: string;
}

export interface RiskMetrics {
  baseInterestRate: number;
  sustainabilityScore: number; // 0-100
  verificationConfidence: number; // 0-1
  collateralValue: number;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  VERIFICATION = 'VERIFICATION',
  VISUAL = 'VISUAL',
  RISK = 'RISK',
}

export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
}

// New Types for Onboarding and Auth
export type UserRole = 'BORROWER' | 'LENDER' | 'AUDITOR' | null;

export interface UserProfile {
  name: string;
  role: UserRole;
  organization: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
}