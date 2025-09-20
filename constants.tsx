import React, { ReactNode } from 'react';
import { ViolationStatus, Violation, DashboardCardData, NavItem, Officer, Hotspot, PredictedHotspot, SafetyAlert } from './types';

const ChartBarIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
);

const DocumentTextIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
);

const ShieldCheckIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286Zm0 13.036h.008v.008h-.008v-.008Z" />
    </svg>
);

const Cog6ToothIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.43.992a6.759 6.759 0 0 1 0 1.25c.008.379.137.752.43.992l1.004.827a1.125 1.125 0 0 1 .26 1.43-1.125 1.125 0 0 1-1.37.49l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.51 6.51 0 0 1-.22.128c-.333.183-.582.495-.645.87l-.213 1.28c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.063-.374-.313-.686-.645-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.075-.124l-1.217.456a1.125 1.125 0 0 1-1.37-.49l-1.296-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.759 6.759 0 0 1 0-1.25c-.007-.379-.138-.752-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43 1.125 1.125 0 0 1 1.37-.49l1.217.456c.355.133.75.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.645-.87l.213-1.281Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);

const HomeIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
);

const CurrencyRupeeIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 8.25H9m6 3H9m3 6-3-3h1.5a3 3 0 1 0 0-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

const ExclamationTriangleIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
);

const MapPinIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
);

const ArrowUpTrayIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
    </svg>
);

const ChatBubbleLeftRightIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72.372a3.375 3.375 0 0 1-3.497-3.329V12.5a3.375 3.375 0 0 1 3.375-3.375h.958c.245 0 .488.023.721.069l2.493 1.332ZM12.25 5.25h-1.5a3.375 3.375 0 0 0-3.375 3.375v6.5a3.375 3.375 0 0 0 3.375 3.375h1.5a3.375 3.375 0 0 0 3.375-3.375v-6.5a3.375 3.375 0 0 0-3.375-3.375Z" />
    </svg>
);

const LightBulbIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-1.837a6.01 6.01 0 0 0-3 0M12 12.75v5.25m0-5.25a6.01 6.01 0 0 1 1.5-1.837a6.01 6.01 0 0 1-3 0m3 1.837V18m-3-5.25v5.25m0-5.25a6.01 6.01 0 0 0-1.5-1.837a6.01 6.01 0 0 0 3 0m-3 1.837V18m-3-5.25v5.25m0-5.25a6.01 6.01 0 0 0-1.5-1.837a6.01 6.01 0 0 0 3 0m3 1.837V18m-3-5.25a6.01 6.01 0 0 0-1.5-1.837a6.01 6.01 0 0 0 3 0m0 1.837a6.01 6.01 0 0 1-1.5 1.837m1.5-1.837a6.01 6.01 0 0 1 1.5 1.837m-1.5-1.837a6.01 6.01 0 0 0-1.5 1.837m-1.5-1.837a6.01 6.01 0 0 0 1.5 1.837M12 12.75a6.01 6.01 0 0 0 1.5-1.837a6.01 6.01 0 0 0-3 0m3 1.837a6.01 6.01 0 0 1-1.5 1.837m1.5-1.837a6.01 6.01 0 0 1 1.5 1.837m-1.5-1.837a6.01 6.01 0 0 0-1.5 1.837m-1.5-1.837a6.01 6.01 0 0 0 1.5 1.837m-3 0a6.01 6.01 0 0 1-1.5-1.837m1.5 1.837a6.01 6.01 0 0 1 1.5 1.837m-1.5-1.837a6.01 6.01 0 0 0-1.5 1.837m1.5-1.837a6.01 6.01 0 0 0 1.5 1.837m1.5-1.837a6.01 6.01 0 0 1-1.5 1.837m-1.5-1.837a6.01 6.01 0 0 0 1.5 1.837m1.5-1.837a6.01 6.01 0 0 1-1.5 1.837m1.5-1.837a6.01 6.01 0 0 1 1.5 1.837m1.5-1.837a6.01 6.01 0 0 0-1.5 1.837m1.5-1.837a6.01 6.01 0 0 0 1.5 1.837M9 5.25a3 3 0 0 1 6 0 3 3 0 0 1-6 0Z" />
    </svg>
);


export const NAV_ITEMS: NavItem[] = [
    { name: 'Dashboard', icon: <HomeIcon className="w-6 h-6"/>, href: '#' },
    { name: 'Violations', icon: <DocumentTextIcon className="w-6 h-6"/>, href: '#' },
    { name: 'Analytics', icon: <ChartBarIcon className="w-6 h-6"/>, href: '#' },
    { name: 'Enforcement', icon: <ShieldCheckIcon className="w-6 h-6"/>, href: '#' },
    { name: 'Predictive Analytics', icon: <LightBulbIcon className="w-6 h-6"/>, href: '#' },
    { name: 'AI Chatbot', icon: <ChatBubbleLeftRightIcon className="w-6 h-6"/>, href: '#' },
    { name: 'Upload', icon: <ArrowUpTrayIcon className="w-6 h-6"/>, href: '#' },
    { name: 'Settings', icon: <Cog6ToothIcon className="w-6 h-6"/>, href: '#' },
];

export const DASHBOARD_CARD_TEMPLATES = [
    {
        id: "totalViolations",
        title: "Total Violations (Today)",
        icon: <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />,
        changeType: "increase"
    },
    {
        id: "revenueToday",
        title: "Revenue Collected (Today)",
        icon: <CurrencyRupeeIcon className="w-8 h-8 text-green-500" />,
        changeType: "increase"
    },
    {
        id: "pendingFines",
        title: "Pending Fines",
        icon: <DocumentTextIcon className="w-8 h-8 text-yellow-500" />,
        changeType: "decrease"
    },
    {
        id: "activeHotspots",
        title: "Active Hotspots",
        icon: <MapPinIcon className="w-8 h-8 text-blue-500" />,
        changeType: "increase"
    }
] as const;


export const ANALYTICS_DATA = [
    { name: 'Mon', violations: 180 },
    { name: 'Tue', violations: 210 },
    { name: 'Wed', violations: 250 },
    { name: 'Thu', violations: 220 },
    { name: 'Fri', violations: 310 },
    { name: 'Sat', violations: 350 },
    { name: 'Sun', violations: 290 },
];

export const VIOLATION_TYPE_DATA = [
    { name: 'Speeding', value: 400 },
    { name: 'Red Light', value: 300 },
    { name: 'No Parking', value: 180 },
    { name: 'Wrong Lane', value: 120 },
    { name: 'Illegal U-Turn', value: 80 },
];

export const OFFICERS_DATA: Officer[] = [
    { id: 'O-001', name: 'Rohan Sharma', avatar: 'https://picsum.photos/seed/officer1/40/40', status: 'On Patrol', zone: 'Zone A (South Mumbai)', vehicleId: 'FP-101' },
    { id: 'O-002', name: 'Priya Singh', avatar: 'https://picsum.photos/seed/officer2/40/40', status: 'On Patrol', zone: 'Zone B (North Delhi)', vehicleId: 'FP-102' },
    { id: 'O-003', name: 'Amit Patel', avatar: 'https://picsum.photos/seed/officer3/40/40', status: 'On Break', zone: 'Zone C (West Bangalore)', vehicleId: 'FP-103' },
    { id: 'O-004', name: 'Sunita Gupta', avatar: 'https://picsum.photos/seed/officer4/40/40', status: 'On Patrol', zone: 'Zone D (East Chennai)', vehicleId: 'FP-104' },
    { id: 'O-005', name: 'Vikram Kumar', avatar: 'https://picsum.photos/seed/officer5/40/40', status: 'Off Duty', zone: 'Zone A (South Mumbai)', vehicleId: 'FP-105' },
    { id: 'O-006', name: 'Anjali Mehta', avatar: 'https://picsum.photos/seed/officer6/40/40', status: 'Off Duty', zone: 'Zone B (North Delhi)', vehicleId: 'FP-106' },
];

export const HOTSPOTS_DATA: Hotspot[] = [
    { id: 1, location: 'ITO Crossing, Delhi', riskLevel: 'High', avgViolationsPerDay: 25, commonViolation: 'Red Light' },
    { id: 2, location: 'Mumbai-Pune Expressway', riskLevel: 'High', avgViolationsPerDay: 32, commonViolation: 'Speeding' },
    { id: 3, location: 'Select Citywalk Mall, Delhi', riskLevel: 'Medium', avgViolationsPerDay: 18, commonViolation: 'No Parking' },
    { id: 4, location: 'Silk Board Junction, Bangalore', riskLevel: 'Medium', avgViolationsPerDay: 15, commonViolation: 'Wrong Lane' },
    { id: 5, location: 'Koregaon Park, Pune', riskLevel: 'Low', avgViolationsPerDay: 8, commonViolation: 'Illegal U-Turn' },
];

export const PREDICTIVE_HOTSPOTS_DATA: Record<string, PredictedHotspot[]> = {
  next4Hours: [
    { id: 1, location: 'Mumbai-Pune Expressway @ Lonavala', predictedRisk: 'High', confidence: 92, keyFactors: ['Evening Rush Hour', 'Historical Data'], expectedViolations: ['Speeding', 'Wrong Lane'], recommendedAction: 'Deploy 1 patrol unit for speed monitoring.', coords: [18.75, 73.4] },
    { id: 2, location: 'ITO Crossing, Delhi', predictedRisk: 'Medium', confidence: 85, keyFactors: ['High Traffic Volume', 'Complex Intersection'], expectedViolations: ['Red Light', 'Illegal U-Turn'], recommendedAction: 'Ensure traffic camera is fully operational.', coords: [28.6315, 77.2480] },
  ],
  tomorrowAM: [
    { id: 3, location: 'Marathahalli, Bangalore', predictedRisk: 'High', confidence: 95, keyFactors: ['IT Corridor Traffic', 'Historical Data'], expectedViolations: ['Speeding', 'No Parking'], recommendedAction: 'Deploy 2 officers for presence and enforcement.', coords: [12.9569, 77.7011] },
    { id: 4, location: 'Anna Salai, Chennai', predictedRisk: 'Medium', confidence: 88, keyFactors: ['Morning Commute', 'Weather Forecast: Rain'], expectedViolations: ['Red Light'], recommendedAction: 'Monitor intersection via traffic cams.', coords: [13.05, 80.25] },
    { id: 5, location: 'Cyber Hub, Gurugram', predictedRisk: 'Medium', confidence: 78, keyFactors: ['Office Timings', 'Heavy Vehicle Traffic'], expectedViolations: ['Wrong Lane'], recommendedAction: 'Consider temporary signage for lane discipline.', coords: [28.4968, 77.0886] },
  ],
  thisWeekend: [
    { id: 6, location: 'Phoenix Marketcity, Pune', predictedRisk: 'High', confidence: 93, keyFactors: ['Weekend Shopping Peak', 'Limited Parking'], expectedViolations: ['No Parking'], recommendedAction: 'Deploy 1 patrol unit for parking enforcement.', coords: [18.5627, 73.9167] },
    { id: 7, location: 'Connaught Place, Delhi', predictedRisk: 'High', confidence: 90, keyFactors: ['Nightlife Activity', 'Historical Data (Sat PM)'], expectedViolations: ['Illegal U-Turn', 'No Parking'], recommendedAction: 'Deploy 2 officers for patrol and visibility.', coords: [28.6330, 77.2193] },
    { id: 8, location: 'Bandra-Worli Sea Link, Mumbai', predictedRisk: 'Medium', confidence: 82, keyFactors: ['Increased Weekend Travel'], expectedViolations: ['Speeding'], recommendedAction: 'Automated speed camera monitoring.', coords: [19.03, 72.82] },
  ],
};


export const SAFETY_ALERTS_DATA: SafetyAlert[] = [
    { id: 'SA-001', location: 'Near Cyber Hub, Gurugram', timestamp: '2 min ago', alertType: 'SOS Button', status: 'Active', details: 'User triggered SOS. Last known location pinged.' },
    { id: 'SA-002', location: 'Koregaon Park, Pune', timestamp: '15 min ago', alertType: 'Unsafe Area Report', status: 'Active', details: 'Report of suspicious activity near the park entrance.' },
    { id: 'SA-003', location: 'Anjuna Beach, Goa', timestamp: '45 min ago', alertType: 'SOS Button', status: 'Resolved', details: 'User confirmed safety. Accidental trigger.' },
    { id: 'SA-004', location: 'Sector 18, Noida', timestamp: '1 hour ago', alertType: 'Unsafe Area Report', status: 'Active', details: 'Reports of street lights not working in alleyway.' },
];

export const VIOLATION_TYPES: Violation['violationType'][] = [
    'Speeding', 
    'Red Light', 
    'No Parking', 
    'Wrong Lane', 
    'Illegal U-Turn', 
    'No Helmet (Driver)', 
    'No Helmet (Pillion)', 
    'Triple Riding'
];

export const VIOLATION_FINES: Record<Violation['violationType'], number> = {
    'Speeding': 500,
    'Red Light': 1000,
    'No Parking': 300,
    'Wrong Lane': 400,
    'Illegal U-Turn': 600,
    'No Helmet (Driver)': 800,
    'No Helmet (Pillion)': 800,
    'Triple Riding': 1200,
};