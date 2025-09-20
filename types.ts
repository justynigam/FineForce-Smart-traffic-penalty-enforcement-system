import { ReactNode } from 'react';

export enum ViolationStatus {
  Pending = 'Pending',
  Paid = 'Paid',
  Overdue = 'Overdue',
}

export type Page = 'Dashboard' | 'Violations' | 'Analytics' | 'Enforcement' | 'Predictive Analytics' | 'AI Chatbot' | 'Settings' | 'Upload';

export interface User {
  id: string;
  name: string;
  email: string;
  officerId: string;
}

export interface Violation {
  id: string;
  vehicleNumber: string;
  violationType: 'Speeding' | 'Red Light' | 'No Parking' | 'Wrong Lane' | 'Illegal U-Turn' | 'No Helmet (Driver)' | 'No Helmet (Pillion)' | 'Triple Riding';
  date: string;
  location: string;
  status: ViolationStatus;
  imageUrl: string;
  fine: number;
  description: string;
  confidenceScore: number;
  contributingFactors: string[];
}

export interface SafetyAlert {
  id: string;
  location: string;
  timestamp: string;
  alertType: 'SOS Button' | 'Unsafe Area Report';
  status: 'Active' | 'Resolved';
  details: string;
}


export interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  text: string;
}

export type NavItem = {
    name: string;
    icon: ReactNode;
    href: string;
};

export type DashboardCardData = {
    title: string;
    value: string;
    icon: ReactNode;
    change: string;
    changeType: 'increase' | 'decrease';
};

export interface Officer {
  id: string;
  name: string;
  avatar: string;
  status: 'On Patrol' | 'Off Duty' | 'On Break';
  zone: string;
  vehicleId: string;
}

export interface Hotspot {
  id: number;
  location: string;
  riskLevel: 'High' | 'Medium' | 'Low';
  avgViolationsPerDay: number;
  commonViolation: string;
}

export interface PredictedHotspot {
  id: number;
  location: string;
  predictedRisk: 'High' | 'Medium' | 'Low';
  confidence: number;
  keyFactors: string[];
  expectedViolations: string[];
  recommendedAction: string;
  coords: [number, number]; // [latitude, longitude]
}