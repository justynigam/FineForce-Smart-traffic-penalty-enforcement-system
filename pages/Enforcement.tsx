import React from 'react';
import { OFFICERS_DATA, HOTSPOTS_DATA, SAFETY_ALERTS_DATA } from '../constants';
import { Officer, Hotspot, SafetyAlert } from '../types';

const FireIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M10 2a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 2ZM8.06 4.94a.75.75 0 0 1 0 1.06L6.53 7.53a.75.75 0 0 1-1.06-1.06L6.94 4.94a.75.75 0 0 1 1.12 0ZM11.94 4.94a.75.75 0 0 1 1.06 0l1.53 1.53a.75.75 0 0 1-1.06 1.06L11.94 6a.75.75 0 0 1 0-1.06ZM17 10a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 17 10ZM4.5 12.5a.75.75 0 0 1-.75-.75v-1.5a.75.75 0 0 1 1.5 0v1.5a.75.75 0 0 1-.75.75ZM10 17a.75.75 0 0 1-.75-.75v-1.5a.75.75 0 0 1 1.5 0v1.5a.75.75 0 0 1-.75.75ZM13.06 14.94a.75.75 0 0 1 0-1.06l1.53-1.53a.75.75 0 0 1 1.06 1.06l-1.53 1.53a.75.75 0 0 1-1.06 0ZM6.94 14.94a.75.75 0 0 1-1.06 0l-1.53-1.53a.75.75 0 1 1 1.06-1.06l1.53 1.53a.75.75 0 0 1 0 1.06Zm4.47-5.53a.75.75 0 0 0-1.06-1.06L8.88 9.88a.75.75 0 0 0 1.06 1.06l1.47-1.47Z" clipRule="evenodd" />
    </svg>
);

const ShieldExclamationIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286Zm0 13.036h.008v.008h-.008v-.008Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15h.008v.008H12V15Z" />
    </svg>
);


const getRiskClasses = (risk: Hotspot['riskLevel']) => {
    if (risk === 'High') return 'bg-red-100 text-red-700';
    if (risk === 'Medium') return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
};

const getOfficerStatusClasses = (status: Officer['status']) => {
    if (status === 'On Patrol') return 'bg-green-100 text-green-700';
    if (status === 'On Break') return 'bg-yellow-100 text-yellow-700';
    return 'bg-slate-100 text-slate-500';
};

const getAlertStatusClasses = (status: SafetyAlert['status']) => {
    if (status === 'Active') return { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-700' };
    return { bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-500' };
};


const EnforcementPage: React.FC = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-slate-800 mb-6">Enforcement & Safety Command</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Alerts & Hotspots */}
        <div className="lg:col-span-1 space-y-8">
            {/* Live Safety Alerts */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200/80">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                    <ShieldExclamationIcon className="w-6 h-6 mr-2 text-amber-500" />
                    Live Safety Alerts
                </h3>
                <div className="space-y-3">
                    {SAFETY_ALERTS_DATA.map(alert => {
                        const statusClass = getAlertStatusClasses(alert.status);
                        return (
                            <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${statusClass.bg} ${statusClass.border}`}>
                                <div className="flex justify-between items-center">
                                    <span className={`text-xs font-bold uppercase tracking-wider ${statusClass.text}`}>{alert.alertType}</span>
                                    <span className="text-xs text-slate-400">{alert.timestamp}</span>
                                </div>
                                <p className="font-semibold text-slate-700 mt-1">{alert.location}</p>
                                <p className="text-sm text-slate-500">{alert.details}</p>
                                {alert.status === 'Active' && <span className="absolute top-2 right-2 h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                                </span>}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Violation Hotspots */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200/80">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <FireIcon className="w-6 h-6 mr-2 text-red-500" />
                Violation Hotspots
              </h3>
              <div className="space-y-4">
                {HOTSPOTS_DATA.map(hotspot => (
                  <div key={hotspot.id} className="border border-slate-200 p-4 rounded-lg hover:bg-slate-50 transition">
                    <div className="flex justify-between items-start">
                      <p className="font-semibold text-slate-700">{hotspot.location}</p>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getRiskClasses(hotspot.riskLevel)}`}>{hotspot.riskLevel}</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                      ~{hotspot.avgViolationsPerDay} violations/day (mostly {hotspot.commonViolation})
                    </p>
                  </div>
                ))}
              </div>
            </div>
        </div>

        {/* Right Column: Officer Activity Table */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-slate-200/80 overflow-hidden self-start">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-slate-800">Officer Activity</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="p-4 font-medium">Officer</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Assigned Zone</th>
                  <th className="p-4 font-medium">Vehicle ID</th>
                </tr>
              </thead>
              <tbody>
                {OFFICERS_DATA.map(officer => (
                  <tr key={officer.id} className="border-b border-slate-200 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <img src={officer.avatar} alt={officer.name} className="w-10 h-10 rounded-full" />
                        <div>
                          <p className="font-semibold text-slate-800">{officer.name}</p>
                          <p className="text-xs text-slate-500">{officer.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getOfficerStatusClasses(officer.status)}`}>{officer.status}</span>
                    </td>
                    <td className="p-4 text-slate-600">{officer.zone}</td>
                    <td className="p-4 text-slate-600 font-mono">{officer.vehicleId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnforcementPage;